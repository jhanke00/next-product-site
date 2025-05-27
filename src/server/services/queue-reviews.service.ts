import { ReviewInsert } from '@/src/server/repositories/review/types';
import { serverEnv } from '@/src/config/env';
import { from, Observable, repeat, Subscription, tap } from 'rxjs';
import { sqsClient } from '@/src/server/config/sqs';
import { DeleteMessageBatchCommand, ReceiveMessageCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Message as SQSMessage } from '@aws-sdk/client-sqs/dist-types/models/models_0';
import { retryWithExponentialBackoffUtil } from '@/src/server/utils/retry-with-exponential-backoff.util';
import { db } from '@/src/server/config/db';
import { Cache } from '@/src/server/config/cache';
import { reviewsTable } from '@/src/server/repositories/review/review.schema';
import { avg, count, eq, sql } from 'drizzle-orm';
import { productsTable } from '@/src/server/repositories/product/product.schema';
import { cacheKeys } from '@/src/server/utils/cache-keys.util';

type ReviewMessage = Required<Pick<ReviewInsert, 'review' | 'product' | 'rating' | 'user' | 'id'>>;

class QueueReviewsService {
  private SQS_QUEUE_URL = serverEnv.AWS_SQS_REVIEWS_QUEUE_URL;
  private observable: Observable<void> = new Observable<void>();
  private subscriber: Subscription | null = null;

  private async receiveMessage() {
    try {
      console.debug('ReceiveMessageCommand is sent to SQS.');

      const message = await sqsClient.send(
        new ReceiveMessageCommand({
          MaxNumberOfMessages: serverEnv.AWS_SQS_REVIEWS_MAX_NUMBER_OF_MESSAGES,
          MessageAttributeNames: ['All'],
          QueueUrl: this.SQS_QUEUE_URL,
          WaitTimeSeconds: serverEnv.AWS_SQS_REVIEWS_WAIT_TIME_SECONDS,
          VisibilityTimeout: serverEnv.AWS_SQS_REVIEWS_VISIBILITY_TIMEOUT,
        })
      );

      console.debug('Receiving messages: ', JSON.stringify(message, null, 2));

      const { Messages: sqsMessages = [] } = message;

      await this.handleMessages({ sqsMessages });
    } catch (error) {
      console.error('Error receiving message', JSON.stringify(error, null, 2));

      this.unsubscribe();
    }
  }

  private async handleMessages(params: { sqsMessages: SQSMessage[] }) {
    const { sqsMessages } = params;

    console.debug('Start handling messages: ', JSON.stringify(sqsMessages, null, 2));

    const successfullyProcessedSQSMessages: SQSMessage[] = [];
    const successfullyProcessedMessages: ReviewMessage[] = [];

    try {
      for (const sqsMessage of sqsMessages) {
        if (!sqsMessage.Body) {
          continue;
        }

        const message: ReviewMessage = JSON.parse(sqsMessage.Body);

        const value = await retryWithExponentialBackoffUtil({
          callback: async () => {
            return this.handleSingleMessage(message);
          },
        });

        console.log({ value });

        successfullyProcessedSQSMessages.push(sqsMessage);
        successfullyProcessedMessages.push(message);
      }
    } catch (error) {
      console.error('Review Message processing', JSON.stringify(error, null, 2));
    }

    console.debug('Successfully processed SQA messages ', JSON.stringify(successfullyProcessedSQSMessages, null, 2));

    if (!successfullyProcessedSQSMessages.length) {
      return;
    }

    const productsCacheKeys = successfullyProcessedMessages.map((value) => {
      return cacheKeys.generateProductKey(value.product);
    });

    const cache = Cache.instance;

    await cache.del(productsCacheKeys);

    await sqsClient.send(
      new DeleteMessageBatchCommand({
        QueueUrl: this.SQS_QUEUE_URL,
        Entries: successfullyProcessedSQSMessages.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle,
        })),
      })
    );
  }

  private async handleSingleMessage(message: ReviewMessage) {
    const reviewToCreate: ReviewInsert = {
      id: message.id,
      product: message.product,
      rating: message.rating,
      review: message.review,
      user: message.user,
    };

    await db.transaction(async (tx) => {
      await tx.insert(reviewsTable).values(reviewToCreate);

      const subquery = tx.$with('subquery').as(
        tx
          .select({
            product: reviewsTable.product,
            reviewsCount: count().as('reviews_count'),
            averageRating: avg(reviewsTable.rating).as('average_rating'),
          })
          .from(reviewsTable)
          .where(eq(reviewsTable.product, reviewToCreate.product))
          .groupBy(reviewsTable.product)
      );

      await tx
        .with(subquery)
        .update(productsTable)
        .set({
          rating: sql`subquery.average_rating`,
          numReviews: sql`subquery.reviews_count`,
        })
        .from(subquery)
        .where(eq(productsTable.id, sql`subquery.product`));
    });

    return message;
  }

  async sendMessage(params: { message: ReviewMessage }) {
    const MESSAGE_GROUP_ID = 'review-group-id';

    const { message } = params;

    const command = new SendMessageCommand({
      QueueUrl: this.SQS_QUEUE_URL,
      MessageDeduplicationId: message.id,
      MessageBody: JSON.stringify(message),
      MessageGroupId: MESSAGE_GROUP_ID,
    });

    try {
      await sqsClient.send(command);
    } catch (error) {
      console.error('Error processing message', JSON.stringify(error, null, 2));

      throw error;
    }
  }

  unsubscribe() {
    this.subscriber?.unsubscribe();
    this.subscriber = null;
  }

  subscribe() {
    if (this.subscriber) {
      return;
    }

    this.observable = from(this.receiveMessage());

    this.subscriber = this.observable
      .pipe(
        tap(() => {
          this.observable = from(this.receiveMessage());
        }),
        repeat({ delay: () => this.observable })
      )
      .subscribe();
  }
}

export const sqsReviewsService = new QueueReviewsService();
