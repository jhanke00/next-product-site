import { db } from '@/src/server/config/db';
import { reviewsTable } from '@/src/server/repositories/review/review.schema';
import { and, asc, count, eq } from 'drizzle-orm';
import { ReviewInsert, ReviewSelect } from '@/src/server/repositories/review/types';
import { pick } from '@utils/pick';
import { DEFAULT_REVIEWS_PAGINATION } from '@/src/server/constants/reviews';
import { usersTable } from '@/src/server/repositories/user/user.schema';
import { ProductSelect } from '@/src/server/repositories/product/types';

class ReviewRepository {
  private readonly review = {
    id: reviewsTable.id,
    user: reviewsTable.user,
    product: reviewsTable.product,
    rating: reviewsTable.rating,
    review: reviewsTable.review,
    createdAt: reviewsTable.createdAt,
  };

  async findManyPaginated(
    params: { limit?: number; offset?: number; productId: ProductSelect['id'] } & Partial<Pick<ReviewSelect, 'rating'>>
  ) {
    const {
      offset = DEFAULT_REVIEWS_PAGINATION.offset,
      limit = DEFAULT_REVIEWS_PAGINATION.limit,
      productId,
      rating,
    } = params;

    const where = rating
      ? and(eq(reviewsTable.rating, rating), eq(reviewsTable.product, productId))
      : eq(reviewsTable.product, productId);

    const reviewsQuery = db
      .select({
        id: this.review.id,
        product: this.review.product,
        rating: this.review.rating,
        review: this.review.review,
        createdAt: this.review.createdAt,
        user: {
          id: usersTable.id,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          email: usersTable.email,
        },
      })
      .from(reviewsTable)
      .orderBy(asc(this.review.createdAt))
      .leftJoin(usersTable, eq(this.review.user, usersTable.id))
      .where(where)
      .limit(limit)
      .offset(offset);

    const reviewsCountQuery = db
      .select({
        count: count(),
      })
      .from(reviewsTable)
      .where(where);

    const [reviews, reviewsCount] = await Promise.all([reviewsQuery, reviewsCountQuery]);

    return { reviews, count: reviewsCount[0].count };
  }

  async create<TSelect extends Array<keyof ReviewInsert>>(params: {
    reviewToCreate: Omit<ReviewInsert, 'id'>;
    select?: TSelect;
  }): Promise<Pick<ReviewInsert, TSelect[number]>> {
    const { reviewToCreate, select = [] } = params;

    const [review] = await db.insert(reviewsTable).values(reviewToCreate).returning(pick(this.review, select));

    return review;
  }
}

export const reviewRepository = new ReviewRepository();
