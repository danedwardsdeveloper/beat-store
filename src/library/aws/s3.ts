import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import logger from '@/library/logger'

import { awsAccessKey, awsSecretAccessKey } from './awsConfiguration'

export const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey,
  },
})

export type S3ContentType = 'image/png' | 'image/webp' | 'audio/mpeg' | 'audio/wav' | 'application/zip'

interface S3UploadParams {
  key: string
  data: Buffer
  contentType: S3ContentType
}

interface S3UploadResult {
  success: boolean
  key: string
  error?: string
  location?: string
}

export async function uploadToS3({ key, contentType, data }: S3UploadParams): Promise<S3UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: 'beat-store',
      Key: key,
      Body: data,
      ContentType: contentType,
    })

    await s3Client.send(command)
    logger.info(`Successfully uploaded ${key} to S3`)

    return {
      success: true,
      key,
      location: `https://beat-store.s3.amazonaws.com/${key}`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown S3 upload error'
    logger.error(`Failed to upload ${key} to S3`, { error: errorMessage })

    return {
      success: false,
      key,
      error: errorMessage,
    }
  }
}

export async function checkFileExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: 'beat-store',
        Key: key,
      }),
    )
    return true
  } catch (error) {
    if ((error as Error).name === 'NotFound') {
      return false
    }
    throw error
  }
}
