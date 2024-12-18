import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { s3Client } from '@/library/aws/s3client'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/auth/protectedRoute'
import { AuthResponses, BasicResponses, HttpStatus } from '@/app/api/types'

export type AssetType = 'image' | 'taggedMp3' | 'untaggedMp3' | 'wav' | 'zippedStems'

export type FileType = 'image/png' | 'audio/mpeg' | 'audio/wav' | 'application/zip'

export interface AdminBeatsAssetsBodyPOST {
  file: Buffer
  fileName: string
  assetType: AssetType
}

export interface AdminBeatsAssetsResponsePOST {
  message: BasicResponses | AuthResponses | 's3 upload error'
  beat?: Beat
}

export const config = {
  api: {
    bodyParser: false,
  },
}

// ToDo - main task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<AdminBeatsAssetsResponsePOST>> {
  // TODO Undo temporary authorisation bypass
  return protectedRoute<AdminBeatsAssetsResponsePOST>(request, '', async () => {
    const { beatId } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string
    const assetType = formData.get('assetType') as AssetType

    // ToDo later...
    // Validate the files
    // Image must be PNG 1000 x 1000

    let thumbnail
    let fullSizeImage
    let socialImage

    if (assetType === 'image') {
      // Generate the other images from the base image
      thumbnail = ''
      fullSizeImage = ''
      socialImage = ''
    }

    const s3Key = (() => {
      switch (assetType) {
        case 'image':
          return `${beatId}/${fileName}image.jpg`
        case 'taggedMp3':
          return `${beatId}/${fileName}-tagged.mp3`
        case 'untaggedMp3':
          return `${beatId}/${fileName}-untagged.mp3`
        case 'wav':
          return `${beatId}/${fileName}.wav`
        case 'zippedStems':
          return `${beatId}/${fileName}.zip`
        default:
          return null
      }
    })()

    try {
      // Upload the asset(s) to S3
      logger.info('Asset successfully uploaded to S3')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown S3 upload error'
      logger.error('Failed to upload asset to S3', { errorMessage })
      return NextResponse.json(
        { message: 's3 upload error' },
        { status: HttpStatus.http503serviceUnavailable },
      )
    }

    try {
      const updatedBeat = await prisma.beat.update({
        where: {
          id: beatId,
        },
        data: {
          thumbnailKey: thumbnail,
          fullSizeArtworkKey: fullSizeImage,
          socialPhotoKey: socialImage,
          taggedMp3Key: null,
          untaggedMp3Key: null,
          wavKey: null,
          zippedStemsKey: null,
        },
      })

      logger.info('Beat document updated successfully')
      return NextResponse.json({ message: 'success', beat: updatedBeat }, { status: HttpStatus.http200ok })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
      logger.error('Database error:', { error: errorMessage })
      return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
    }
  })
}
