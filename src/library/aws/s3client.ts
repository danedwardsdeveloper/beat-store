import { S3Client } from '@aws-sdk/client-s3'

import { awsAccessKey, awsSecretAccessKey } from './awsConfiguration'

export const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey,
  },
})
