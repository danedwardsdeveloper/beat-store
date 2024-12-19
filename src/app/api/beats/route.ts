import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { BasicMessages, HttpStatus, SafePublicBeat } from '@/app/api/types'

export interface BeatsGET {
  message: BasicMessages | 'no beats found'
  beats?: SafePublicBeat[]
}

export async function GET(request: NextRequest): Promise<NextResponse<BeatsGET>> {
  try {
    const activeBeats = await prisma.beat.findMany({
      where: {
        isDraft: false,
        isHidden: false,
        isExclusiveSold: false,
        releaseDate: {
          lte: new Date(),
        },
      },
      select: {
        id: true,
        title: true,
        metaTitle: true,
        description: true,
        metaDescription: true,
        duration: true,
        bpm: true,
        musicalKeyLetter: true,
        tonality: true,
        genres: true,
        instruments: true,
        soundsLike: true,
        tags: true,
        useDefaultPrices: true,
        customPriceBasic: true,
        customPricePremium: true,
        customPriceUnlimited: true,
        customPriceExclusive: true,
        discountPercentage: true,
        discountExpiresAt: true,
        fullSizeArtworkKey: true,
        thumbnailKey: true,
        socialPhotoKey: true,
        taggedMp3Key: true,
        playCount: true,
        favouriteCount: true,
      },
      orderBy: {
        releaseDate: 'desc',
      },
    })

    logger.info('SafePublicBeats retrieved')
    return NextResponse.json(
      {
        message: 'success',
        beats: activeBeats,
      },
      { status: HttpStatus.http200ok },
    )
  } catch (error) {
    logger.error('Error getting public beat data: ', error)
    return NextResponse.json({ message: 'database error' }, { status: HttpStatus.http503serviceUnavailable })
  }
}
