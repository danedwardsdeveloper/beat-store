import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

import { s3Client } from '@/library/aws/s3client'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/auth/protectedRoute'
import { BasicResponses, HttpStatus } from '@/app/api/types'

export type AssetType = 'image' | 'taggedMp3' | 'untaggedMp3' | 'wav' | 'zippedStems'

export type FileType = 'image/jpeg' | 'image/png' | 'audio/mpeg' | 'audio/wav' | 'application/zip'

export interface AdminBeatsAssetsBodyPOST {
  file: Buffer
  fileName: string
  assetType: AssetType
}

export interface AdminBeatsAssetsResponsePOST {
  message: BasicResponses | 's3 upload error'
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<AdminBeatsAssetsResponsePOST>> {
  return protectedRoute<AdminBeatsAssetsResponsePOST>(request, 'admin', async () => {
    const { beatId } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string
    const assetType = formData.get('assetType') as AssetType

    // The S3 key for each asset is predictable as it just uses the beat ID
    // On successful upload, the beat document is updated with stems=true etc. to keep track of what has been uploaded
    // Then to display the beats on the front-end I'll just use normal CloudFront URLs for the images, as these are public
    // However, as the WAV and stems are paid content, I'll use pre-signed URLs for these, as people could guess the paths for them based on the images etc.

    const fileType = file.type as FileType
    if (!isValidFileType(assetType, fileType)) {
      return NextResponse.json({ message: 'invalid file type' }, { status: HttpStatus.BAD_REQUEST })
    }

    const mediaKey = '' //generate a hashed media key plus the original file name for version tracking

    if (assetType === 'image') {
      // Use Sharp to create the thumbnail and social images
    }

    try {
      // Upload the assets
      await s3Client.send(
        new PutObjectCommand({
          Bucket: 'beat-store',
          Key: null,
          Body: null,
          ContentType: null,
        }),
      )
    } catch {
      return NextResponse.json({ message: 's3 upload error' })
    }

    try {
      // update the asset keys in the database
      const mediaKey = await prisma.beat.findUnique({
        where: {
          id: beatId,
        },
      })

      return NextResponse.json({ message: 'success' })
    } catch {
      return NextResponse.json({ message: 'server error' })
    }
  })
}
