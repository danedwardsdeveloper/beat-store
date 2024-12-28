import { Beat } from '@prisma/client'
import { parseBuffer } from 'music-metadata'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

import protectedRoute from '@/library/auth/protectedRoute'
import { checkFileExists, S3ContentType, uploadToS3 } from '@/library/aws/s3'
import prisma from '@/library/database/prisma'
import { generateSocialImage } from '@/library/images/generateImages'
import logger from '@/library/misc/logger'
import sanitiseFileName from '@/library/misc/sanitiseFileName'

import { BasicMessages, HttpStatus } from '@/app/api/types'

export type AssetType = 'artwork' | 'taggedMp3' | 'untaggedMp3' | 'wav' | 'zippedStems'

export interface AdminBeatsAssetsBodyPOST {
  file: File
  assetType: AssetType
}

enum InputFileType {
  'image/png' = 'image/png',
  'image/webp' = 'image/webp',
  'audio/mpeg' = 'audio/mpeg',
  'audio/wave' = 'audio/wave',
  'application/zip' = 'application/zip',
}

// Not sure if this is needed
export const config = {
  api: {
    bodyParser: false,
  },
}

type BeatAssetUpdate = Partial<
  Pick<Beat, 'originalArtworkFileName' | 'duration' | 'taggedMp3' | 'untaggedMp3' | 'wav' | 'stems'>
>

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
    | 'image too large'
    | 'image not square'
    | 'image processing failed'
    | 'audio processing failed'
    | 'file too big'
    | 'beat not found'
    | 'storage error'
    | 'S3 upload error'
  beat?: Beat
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
    if (
      assetType !== 'artwork' &&
      assetType !== 'taggedMp3' &&
      assetType !== 'untaggedMp3' &&
      assetType !== 'wav' &&
      assetType !== 'zippedStems'
    ) {
      logger.error(`Invalid asset type: ${assetType}`)
      return NextResponse.json(
        { message: 'invalid asset type' },
        {
          status: HttpStatus.http400badRequest,
        },
      )
    }

    if (
      (assetType === 'artwork' && fileType !== InputFileType['image/png']) ||
      ((assetType === 'taggedMp3' || assetType === 'untaggedMp3') &&
        fileType !== InputFileType['audio/mpeg']) ||
      (assetType === 'wav' && fileType !== InputFileType['audio/wave']) ||
      (assetType === 'zippedStems' && fileType !== InputFileType['application/zip'])
    ) {
      logger.error('File type mismatch:', { assetType, fileType })
      return NextResponse.json({ message: 'mismatched format' }, { status: HttpStatus.http400badRequest })
    }

    // 5. Check the provided beatId has a corresponding database document
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

    // Generate file names
    const sanitisedFileName = sanitiseFileName(file.name)
    const fileNameOptions = {
      artwork: {
        full: `${foundBeatId}/full.webp`,
        social: `${foundBeatId}/social.png`,
        thumb: `${foundBeatId}/thumb.webp`,
      },
      wav: `${foundBeatId}/audio.wav`,
      taggedMp3: `${foundBeatId}/tagged.mp3`,
      untaggedMp3: `${foundBeatId}/untagged.mp3`,
      stems: `${foundBeatId}/stems.zip`,
    }
    const fileName =
      assetType === 'artwork'
        ? fileNameOptions.artwork.full
        : assetType === 'wav'
          ? fileNameOptions.wav
          : assetType === 'taggedMp3'
            ? fileNameOptions.taggedMp3
            : assetType === 'untaggedMp3'
              ? fileNameOptions.untaggedMp3
              : fileNameOptions.stems

    const s3contentType: S3ContentType = (() => {
      if (assetType === 'wav') return 'audio/wav'
      if (assetType === 'taggedMp3' || assetType === 'untaggedMp3') return 'audio/mpeg'
      if (assetType === 'zippedStems') return 'application/zip'
      return 'image/png'
    })()

    // 6. Check if asset has already been uploaded
    try {
      const filesToCheck = assetType === 'artwork' ? Object.values(fileNameOptions.artwork) : [fileName]
      const existingFiles = await Promise.all(
        filesToCheck.map(async key => {
          const fileExists = await checkFileExists(key)
          return fileExists ? key : null
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

    // Prepare the buffer
    const updateData: BeatAssetUpdate = {}
    let buffer: Buffer

    try {
      buffer = Buffer.from(await file.arrayBuffer())
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

    if (assetType === 'artwork') {
      const { height, width } = await sharp(buffer).metadata()
      if (!width || !height || width !== height || width < 1000 || width > 1000) {
        return NextResponse.json(
          {
            message:
              !width || !height
                ? 'invalid image'
                : width !== height
                  ? 'image not square'
                  : width < 1000
                    ? 'image too small'
                    : 'image too large',
          },
          { status: HttpStatus.http400badRequest },
        )
      }

      try {
        const convertedBuffer = await sharp(buffer).webp().toBuffer()
        const socialBuffer = await generateSocialImage(buffer)
        const thumbBuffer = await sharp(buffer).resize(120, 120, { fit: 'cover' }).webp().toBuffer()

        const uploads = await Promise.all([
          uploadToS3({
            key: fileNameOptions.artwork.full,
            data: convertedBuffer,
            contentType: s3contentType,
          }),
          uploadToS3({
            key: fileNameOptions.artwork.thumb,
            data: thumbBuffer,
            contentType: s3contentType,
          }),
          uploadToS3({
            key: fileNameOptions.artwork.social,
            data: socialBuffer,
            contentType: 'image/png',
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
          return NextResponse.json({ message: 'S3 upload error' }, { status: HttpStatus.http500serverError })
        }
        logger.info('Images uploaded successfully')
        updateData.originalArtworkFileName = sanitisedFileName
        // No return statement because database still needs to be updated
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
    } else {
      // All assets except images need the file size, so get this first
      const fileSizeInMb = Math.round((buffer.length / (1024 * 1024)) * 100) / 100
      const fileHeader = Buffer.from(buffer.subarray(0, 4))

      if (assetType === 'zippedStems') {
        const TwoGigabytesInMegabytes = 2 * 1024
        if (fileSizeInMb > TwoGigabytesInMegabytes) {
          logger.error('Stems file too large:', { fileSizeInMb })
          return NextResponse.json({ message: 'file too big' }, { status: HttpStatus.http400badRequest })
        }

        const validZipHeader = [0x50, 0x4b, 0x03, 0x04]
        const hasValidZipHeader = validZipHeader.every((byte, i) => fileHeader[i] === byte)

        if (!hasValidZipHeader) {
          logger.error('Invalid ZIP file format')
          return NextResponse.json(
            { message: 'invalid file format' },
            { status: HttpStatus.http400badRequest },
          )
        }
        updateData.stems = {
          originalFileName: sanitisedFileName,
          fileSizeInMb,
        }
      } else {
        try {
          const audioMetadata = await parseBuffer(buffer)
          if (!audioMetadata.format.duration) {
            logger.error('Audio metadata missing duration: ', audioMetadata)
            return NextResponse.json(
              { message: 'audio processing failed' },
              { status: HttpStatus.http500serverError },
            )
          }
          updateData.duration = Math.round(audioMetadata.format.duration)
        } catch (error) {
          logger.error('Failed to parse audio metadata:', error)
          return NextResponse.json(
            { message: 'audio processing failed' },
            { status: HttpStatus.http500serverError },
          )
        }
      }

      if (assetType === 'taggedMp3' || assetType === 'untaggedMp3') {
        const validId3Header = [0x49, 0x44, 0x33]
        const validMpegHeader = fileHeader[0] === 0xff && (fileHeader[1] & 0xe0) === 0xe0
        const hasValidMp3Header = validId3Header.every((byte, i) => fileHeader[i] === byte) || validMpegHeader
        if (!hasValidMp3Header) {
          logger.error('Invalid MP3 file format')
          return NextResponse.json(
            { message: 'invalid file format' },
            { status: HttpStatus.http400badRequest },
          )
        }

        if (assetType === 'taggedMp3') {
          updateData.taggedMp3 = {
            originalFileName: sanitisedFileName,
            fileSizeInMb: fileSizeInMb,
          }
        } else {
          updateData.untaggedMp3 = {
            originalFileName: sanitisedFileName,
            fileSizeInMb,
          }
        }
      }

      if (assetType === 'wav') {
        const wavHeader = Buffer.from(buffer.subarray(8, 12))
        const validRiffHeader = [0x52, 0x49, 0x46, 0x46]
        const validWavHeader = [0x57, 0x41, 0x56, 0x45]
        const hasValidWavHeader =
          validRiffHeader.every((byte, i) => fileHeader[i] === byte) &&
          validWavHeader.every((byte, i) => wavHeader[i] === byte)
        if (!hasValidWavHeader) {
          logger.error('Invalid WAV format - missing RIFF/WAVE header')
          return NextResponse.json(
            { message: 'invalid file format' },
            { status: HttpStatus.http400badRequest },
          )
        }

        updateData.wav = {
          originalFileName: sanitisedFileName,
          fileSizeInMb,
        }
      }

      try {
        const { success, error } = await uploadToS3({
          key: fileName,
          data: buffer,
          contentType: s3contentType,
        })

        if (!success) {
          logger.error('Failed to upload asset to S3', { error, assetType, fileName })
          return NextResponse.json({ message: 'S3 upload error' }, { status: HttpStatus.http500serverError })
        }

        logger.info('Asset successfully uploaded to S3', { assetType, fileName })
        // No return statement because database still needs to be updated
      } catch (error) {
        logger.error('Unexpected error uploading to S3', {
          error: error instanceof Error ? error.message : error,
          assetType,
          fileName,
        })
        return NextResponse.json({ message: 'S3 upload error' }, { status: HttpStatus.http500serverError })
      }
    }

    try {
      const updatedBeat = await prisma.beat.update({
        where: {
          id: foundBeatId,
        },
        data: updateData,
      })
      logger.info('Database uploaded successfully: ', updatedBeat)
      return NextResponse.json(
        {
          message: 'success',
          beat: updatedBeat,
        },
        {
          status: HttpStatus.http200ok,
        },
      )
    } catch {
      return NextResponse.json(
        {
          message: 'server error',
        },
        {
          status: HttpStatus.http500serverError,
        },
      )
    }
  })
}
