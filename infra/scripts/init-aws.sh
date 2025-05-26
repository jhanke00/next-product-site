#!/bin/bash

awslocal cloudformation deploy --stack-name sqs-cfn --template-file "/usr/cloudformation/sqs-cloudformation.yaml"

# Save the output to a variable
QUEUE_URL=$(awslocal cloudformation describe-stacks --stack-name sqs-cfn --query "Stacks[].Outputs[?OutputKey=='SQSQueueUrl'].OutputValue" --output text)
DLQ_URL=$(awslocal cloudformation describe-stacks --stack-name sqs-cfn --query "Stacks[].Outputs[?OutputKey=='SQSDeadLetterQueueUrl'].OutputValue" --output text)

# Display the result
echo "AWS_SQS_REVIEWS_QUEUE_URL: $QUEUE_URL"
echo "DLQ_URL: $DLQ_URL"
