import { GetObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

import { s3Client } from '@/library/aws/s3'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/protectedRoute'
import { BasicMessages, HttpStatus } from '@/app/api/types'

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

// interface SimpleAsset {
//   url: string
// }

// export interface AdminBeatsAssetsResponseGET {
//   message: BasicMessages
//   beatAssets?: BeatAssets
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { beatId: string } },
// ): Promise<NextResponse<AdminBeatsAssetsResponseGET>> {
//   return protectedRoute<AdminBeatsAssetsResponseGET>(request, 'admin', 'require confirmation', async () => {
//     try {
//       const { beatId } = await params
//       if (!beatId) {
//         return NextResponse.json(
//           {
//             message: 'params missing',
//           },
//           {
//             status: HttpStatus.http400badRequest,
//           },
//         )
//       }
//       const assets: BeatAssets = {}

//       const assetConfigs = {
//         artwork: { path: 'full.webp', needsMetadata: false },
//         thumbnail: { path: 'thumb.webp', needsMetadata: false },
//         socialImage: { path: 'social.png', needsMetadata: false },
//         taggedMp3: { path: 'tagged.mp3', needsMetadata: true },
//         untaggedMp3: { path: 'untagged.mp3', needsMetadata: true },
//         wav: { path: 'audio.wav', needsMetadata: true },
//         stems: { path: 'stems.zip', needsMetadata: true },
//       } as const

//       const checkResults = await Promise.allSettled(
//         Object.entries(assetConfigs).map(async ([key, config]) => {
//           const fullPath = `${beatId}/${config.path}`
//           try {
//             const response = await s3Client.send(
//               new GetObjectCommand({
//                 Bucket: 'beat-store',
//                 Key: fullPath,
//               }),
//             )

//             // Todo - this is the S3 url, which can't be viewed
//             const url = `https://beat-store.s3.us-east-1.amazonaws.com/${fullPath}`

//             if (
//               config.needsMetadata &&
//               (key === 'taggedMp3' || key === 'untaggedMp3' || key === 'wav' || key === 'stems')
//             ) {
//               return {
//                 key,
//                 value: {
//                   url,
//                   sizeInMb: Number((response.ContentLength || 0) / (1024 * 1024)).toFixed(2),
//                   originalFileName: config.path,
//                 },
//               }
//             }

//             if (key === 'artwork' || key === 'thumbnail' || key === 'socialImage') {
//               return { key, value: { url } }
//             }

//             return null
//           } catch (error) {
//             if ((error as Error)?.name !== 'NoSuchKey') {
//               logger.error('Error checking S3 asset:', { beatId, path: fullPath, error })
//             }
//             return null
//           }
//         }),
//       )

//       checkResults.forEach(result => {
//         if (result.status === 'fulfilled' && result.value) {
//           const { key, value } = result.value
//           if (key === 'artwork' || key === 'thumbnail' || key === 'socialImage') {
//             assets[key] = value as SimpleAsset
//           } else if (key === 'taggedMp3' || key === 'untaggedMp3' || key === 'wav' || key === 'stems') {
//             assets[key] = value as unknown as AssetWithMetadata
//           }
//         }
//       })

//       return NextResponse.json({ message: 'success', beatAssets: assets }, { status: HttpStatus.http200ok })
//     } catch (error) {
//       logger.error('Failed to retrieve beat assets:', error)
//       return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
//     }
//   })
// }
