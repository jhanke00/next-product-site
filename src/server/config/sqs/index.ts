import { SQSClient } from '@aws-sdk/client-sqs';
import { serverEnv } from '@/src/config/env';

const getSqsClient = () => {
  if (serverEnv.NODE_ENV !== 'production') {
    return new SQSClient({
      region: serverEnv.AWS_DEFAULT_REGION,
      endpoint: 'http://localstack:4566',
      credentials: {
        accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
        secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return new SQSClient({
    region: serverEnv.AWS_DEFAULT_REGION,
  });
};

export const sqsClient = getSqsClient();
