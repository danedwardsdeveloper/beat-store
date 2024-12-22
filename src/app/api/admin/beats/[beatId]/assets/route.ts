/* eslint-disable */
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

import { checkFileExists, s3Client, S3ContentType, uploadToS3 } from '@/library/aws/s3'
import prisma from '@/library/database/prisma'
import { generateSocialImage } from '@/library/images/generateImages'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/protectedRoute'
import { BasicMessages, HttpStatus } from '@/app/api/types'

// Error: Route "/api/admin/beats/[beatId]/assets" used `params.beatId`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis

export interface Asset {
  url: string
}

export interface AssetWithMetadata {
  url: string
  sizeInMb: number
  originalFileName: string
}

export interface BeatAssets {
  artwork?: Asset
  thumbnail?: Asset
  socialImage?: Asset
  taggedMp3?: AssetWithMetadata
  untaggedMp3?: AssetWithMetadata
  wav?: AssetWithMetadata
  stems?: AssetWithMetadata
}

export type AssetType = 'artwork' | 'taggedMp3' | 'untaggedMp3' | 'wav' | 'zippedStems'

export interface AdminBeatsAssetsBodyPOST {
  file: File
  assetType: AssetType
}

enum InputFileType {
  'image/png' = 'image/png',
  'image/webp' = 'image/webp',
  'audio/mpeg' = 'audio/mpeg',
  'audio/wav' = 'audio/wav',
  'application/zip' = 'application/zip',
}

export interface AdminBeatsAssetsResponsePOST {
  message:
    | BasicMessages
    | 'file missing'
    | 'file already exists'
    | 'file processing failed'
    | 'invalid file format'
    | 'invalid asset type'
    | 'mismatched format'
    | 'invalid image'
    | 'image too big'
    | 'image too small'
    | 'image not square'
    | 'image too large'
    | 'image too small'
    | 'image not square'
    | 'WebP conversion failed'
    | 'social image generation failed'
    | 'thumbnail generation failed'
    | 'image processing failed'
    | 'beat not found'
    | 'upload failed'
    | 'storage error'
    | 'S3 upload error'
    | 'update failed'
  beat?: Beat
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
  return protectedRoute<AdminBeatsAssetsResponsePOST>(request, 'admin', 'require confirmation', async () => {
    const { beatId } = await params
    if (!beatId) {
      return NextResponse.json({ message: 'params missing' }, { status: HttpStatus.http400badRequest })
    }

    const formData = await request.formData()
    const { file, assetType }: AdminBeatsAssetsBodyPOST = {
      file: formData.get('file') as File,
      assetType: formData.get('assetType') as AssetType,
    }

    if (!file) {
      logger.error('File missing')
      return NextResponse.json(
        {
          message: 'file missing',
        },
        {
          status: HttpStatus.http400badRequest,
        },
      )
    }

    const fileType = file.type

    if (!(fileType in InputFileType)) {
      logger.error('File format not accepted: ', fileType)
      return NextResponse.json(
        {
          message: 'invalid file format',
        },
        {
          status: HttpStatus.http400badRequest,
        },
      )
    }

    const fileMatchesAssetType = () => {
      switch (assetType) {
        case 'artwork':
          return fileType === InputFileType['image/png']
        case 'taggedMp3':
        case 'untaggedMp3':
          return fileType === InputFileType['audio/mpeg']
        case 'wav':
          return fileType === InputFileType['audio/wav']
        case 'zippedStems':
          return fileType === InputFileType['application/zip']
        default:
          return false
      }
    }

    if (!fileMatchesAssetType()) {
      logger.error(`File doesn't match asset type.`)
      return NextResponse.json(
        {
          message: 'mismatched format',
        },
        {
          status: HttpStatus.http400badRequest,
        },
      )
    }

    const sanitisedFileName = (): string => {
      const withoutExtension = file.name.substring(0, file.name.lastIndexOf('.'))
      const lowercase = withoutExtension.toLowerCase()
      const withoutSpaces = lowercase.replace(/\s+/g, '-')
      const withoutSpecialCharacters = withoutSpaces
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
      return withoutSpecialCharacters || 'unnamed-file'
    }

    const foundBeat = await prisma.beat.findUnique({
      where: { id: beatId },
    })

    if (!foundBeat) {
      return NextResponse.json(
        {
          message: 'beat not found',
        },
        {
          status: HttpStatus.http404notFound,
        },
      )
    }

    const foundBeatId = foundBeat.id

    if (assetType === 'artwork') {
      try {
        const filesToCheck = [
          `${foundBeatId}/full.webp`,
          `${foundBeatId}/social.png`,
          `${foundBeatId}/thumb.webp`,
        ]

        const existingFiles = await Promise.all(
          filesToCheck.map(async key => {
            const exists = await checkFileExists(key)
            return exists ? key : null
          }),
        ).then(results => results.filter(Boolean))

        if (existingFiles.length > 0) {
          logger.warn('Files already exist:', JSON.stringify(existingFiles))
          return NextResponse.json(
            {
              message: 'file already exists',
            },
            { status: HttpStatus.http409conflict },
          )
        }
      } catch (error) {
        logger.error('Error checking for existing files:', error)
        return NextResponse.json({ message: 'storage error' }, { status: HttpStatus.http500serverError })
      }

      const tempBuffer = Buffer.from(await file.arrayBuffer())
      const { height, width } = await sharp(tempBuffer).metadata()

      if (!width || !height) {
        return NextResponse.json({ message: 'invalid image' }, { status: HttpStatus.http400badRequest })
      }

      if (width !== height) {
        return NextResponse.json({ message: 'image not square' }, { status: HttpStatus.http400badRequest })
      }

      if (width < 1000) {
        return NextResponse.json({ message: 'image too small' }, { status: HttpStatus.http400badRequest })
      }

      if (width > 1000) {
        return NextResponse.json({ message: 'image too large' }, { status: HttpStatus.http400badRequest })
      }
      try {
        const convertedBuffer = await sharp(tempBuffer).webp().toBuffer()
        const socialBuffer = await generateSocialImage(tempBuffer)
        const thumbBuffer = await sharp(tempBuffer).resize(120, 120, { fit: 'cover' }).webp().toBuffer()

        const uploads = await Promise.all([
          uploadToS3({
            key: `${foundBeatId}/full.webp`,
            data: convertedBuffer,
            contentType: 'image/webp',
          }),
          uploadToS3({
            key: `${foundBeatId}/social.png`,
            data: socialBuffer,
            contentType: 'image/png',
          }),
          uploadToS3({
            key: `${foundBeatId}/thumb.webp`,
            data: thumbBuffer,
            contentType: 'image/webp',
          }),
        ])

        const failedUploads = uploads.filter(upload => !upload.success)

        if (failedUploads.length > 0) {
          const failedKeys = failedUploads.map(upload => upload.key).join(', ')
          logger.error('Failed to upload some images to S3:', { failedKeys })

          for (const failed of failedUploads) {
            logger.error('Upload error details:', {
              key: failed.key,
              error: failed.error,
            })
          }

          return NextResponse.json(
            { message: 'S3 upload error' },
            { status: HttpStatus.http503serviceUnavailable },
          )
        }

        const [fullUpload, socialUpload, thumbUpload] = uploads

        logger.info('All images uploaded successfully', {
          fullKey: fullUpload.key,
          socialKey: socialUpload.key,
          thumbKey: thumbUpload.key,
        })
        return NextResponse.json(
          {
            message: 'success',
          },
          {
            status: HttpStatus.http200ok,
          },
        )
      } catch (error) {
        logger.error('Image processing failed:', error)
        if (error instanceof Error) {
          return NextResponse.json(
            { message: 'image processing failed' },
            { status: HttpStatus.http500serverError },
          )
        }
        return NextResponse.json(
          { message: 'image processing failed' },
          { status: HttpStatus.http500serverError },
        )
      }
    }

    let buffer: Buffer
    let contentType: S3ContentType

    try {
      buffer = Buffer.from(await file.arrayBuffer())

      switch (assetType) {
        case 'wav':
          contentType = 'audio/wav'
          break
        case 'taggedMp3':
        case 'untaggedMp3':
          contentType = 'audio/mpeg'
          break
        case 'zippedStems':
          contentType = 'application/zip'
          break
        default:
          return NextResponse.json(
            {
              message: 'invalid asset type',
            },
            {
              status: HttpStatus.http400badRequest,
            },
          )
      }
    } catch (error) {
      logger.error('Failed to process file buffer:', error)
      return NextResponse.json(
        {
          message: 'file processing failed',
        },
        {
          status: HttpStatus.http500serverError,
        },
      )
    }

    if (assetType === 'wav' || assetType === 'taggedMp3' || assetType === 'untaggedMp3') {
      // 4. Audio Processing
      // - Validate format
      // - Get duration
      // - Get file size
    }

    let zippedStemsBuffer
    if (assetType === 'zippedStems') {
      // 5. Stems Processing
      // Validate format
      // - Get file size
      contentType = 'application/zip'
    }

    if (!buffer || !contentType) {
      return NextResponse.json({
        message: 'file missing',
      })
    }

    try {
      const upload = await uploadToS3({
        key: 'temp-key',
        data: buffer,
        contentType: contentType,
      })

      logger.info('Asset successfully uploaded to S3')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown S3 upload error'
      logger.error('Failed to upload asset to S3', { errorMessage })
      return NextResponse.json(
        { message: 'S3 upload error' },
        { status: HttpStatus.http503serviceUnavailable },
      )
    }

    try {
      const assetKey = (() => {
        switch (assetType) {
          case 'taggedMp3':
            return `${foundBeat.id}-tagged.mp3`
          case 'untaggedMp3':
            return `${foundBeat.id}-untagged.mp3`
          case 'wav':
            return `${foundBeat.id}.wav`
          case 'zippedStems':
            return `${foundBeat.id}.zip`
          default:
            throw new Error(`Invalid asset type: ${assetType}`)
        }
      })()

      const updateData = {
        [assetType === 'taggedMp3'
          ? 'taggedMp3Key'
          : assetType === 'untaggedMp3'
            ? 'untaggedMp3Key'
            : assetType === 'wav'
              ? 'wavKey'
              : assetType === 'zippedStems'
                ? 'zippedStemsKey'
                : 'artworkKey']: assetKey,
      }

      const updatedBeat = await prisma.beat.update({
        where: { id: foundBeat.id },
        data: updateData,
      })

      logger.info('Beat document updated successfully', {
        foundBeatId: foundBeat.id,
        assetType,
        assetKey,
      })

      return NextResponse.json({ message: 'success', beat: updatedBeat }, { status: HttpStatus.http200ok })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
      logger.error('Database error:', { error: errorMessage })
      return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
    }
  })
}

interface AdminBeatsAssetsResponseDELETE {
  message: 'success'
}

export async function DELETE(request: NextRequest): Promise<NextResponse<AdminBeatsAssetsResponseDELETE>> {
  try {
    logger.info('Delete route accessed!')
    return NextResponse.json(
      { message: 'success' },
      {
        status: HttpStatus.http200ok,
      },
    )
  } catch (error) {
    logger.error('Error in DELETE route:', error)
    return NextResponse.json({ message: 'success' }, { status: HttpStatus.http500serverError })
  }
}

interface SimpleAsset {
  url: string
}

type ImageAssetKey = 'artwork' | 'thumbnail' | 'socialImage'
type MetadataAssetKey = 'taggedMp3' | 'untaggedMp3' | 'wav' | 'stems'

export interface AdminBeatsAssetsResponseGET {
  message: BasicMessages
  beatAssets?: BeatAssets
}

export async function GET(
  request: NextRequest,
  { params }: { params: { beatId: string } },
): Promise<NextResponse<AdminBeatsAssetsResponseGET>> {
  return protectedRoute<AdminBeatsAssetsResponseGET>(request, 'admin', 'require confirmation', async () => {
    try {
      const { beatId } = await params
      if (!beatId) {
        return NextResponse.json(
          {
            message: 'params missing',
          },
          {
            status: HttpStatus.http400badRequest,
          },
        )
      }
      const assets: BeatAssets = {}

      const assetConfigs = {
        artwork: { path: 'full.webp', needsMetadata: false },
        thumbnail: { path: 'thumb.webp', needsMetadata: false },
        socialImage: { path: 'social.png', needsMetadata: false },
        taggedMp3: { path: 'tagged.mp3', needsMetadata: true },
        untaggedMp3: { path: 'untagged.mp3', needsMetadata: true },
        wav: { path: 'audio.wav', needsMetadata: true },
        stems: { path: 'stems.zip', needsMetadata: true },
      } as const

      const checkResults = await Promise.allSettled(
        Object.entries(assetConfigs).map(async ([key, config]) => {
          const fullPath = `${beatId}/${config.path}`
          try {
            const response = await s3Client.send(
              new GetObjectCommand({
                Bucket: 'beat-store',
                Key: fullPath,
              }),
            )

            // Todo - this is the S3 url, which can't be viewed
            const url = `https://beat-store.s3.us-east-1.amazonaws.com/${fullPath}`

            if (
              config.needsMetadata &&
              (key === 'taggedMp3' || key === 'untaggedMp3' || key === 'wav' || key === 'stems')
            ) {
              return {
                key,
                value: {
                  url,
                  sizeInMb: Number((response.ContentLength || 0) / (1024 * 1024)).toFixed(2),
                  originalFileName: config.path,
                },
              }
            }

            if (key === 'artwork' || key === 'thumbnail' || key === 'socialImage') {
              return { key, value: { url } }
            }

            return null
          } catch (error) {
            if ((error as Error)?.name !== 'NoSuchKey') {
              logger.error('Error checking S3 asset:', { beatId, path: fullPath, error })
            }
            return null
          }
        }),
      )

      checkResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          const { key, value } = result.value
          if (key === 'artwork' || key === 'thumbnail' || key === 'socialImage') {
            assets[key] = value as SimpleAsset
          } else if (key === 'taggedMp3' || key === 'untaggedMp3' || key === 'wav' || key === 'stems') {
            assets[key] = value as unknown as AssetWithMetadata
          }
        }
      })

      return NextResponse.json({ message: 'success', beatAssets: assets }, { status: HttpStatus.http200ok })
    } catch (error) {
      logger.error('Failed to retrieve beat assets:', error)
      return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
    }
  })
}
