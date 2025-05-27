import { SQSClient } from '@aws-sdk/client-sqs';
import { env } from '@/src/config/env';

const getSqsClient = () => {
  if (env.NODE_ENV !== 'production') {
    return new SQSClient({
      region: env.AWS_DEFAULT_REGION,
      endpoint: 'http://localstack:4566',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return new SQSClient({
    region: env.AWS_DEFAULT_REGION,
  });
};

export const sqsClient = getSqsClient();
