import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/library/database/prisma'
import { dynamicAssetsBaseURL } from '@/library/environment/configuration'
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
        slug: true,
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
        playCount: true,
        favouriteCount: true,
      },
      orderBy: {
        releaseDate: 'desc',
      },
    })

    const beatsWithAssets: SafePublicBeat[] = activeBeats.map(beat => ({
      ...beat,
      assetUrls: {
        taggedMp3: new URL(`${dynamicAssetsBaseURL}/${beat.id}/tagged.mp3`),
        artworkFull: new URL(`${dynamicAssetsBaseURL}/${beat.id}/full.webp`),
        artworkThumb: new URL(`${dynamicAssetsBaseURL}/${beat.id}/thumb.webp`),
        artworkSocialProxied: new URL(`${dynamicAssetsBaseURL}/${beat.id}/social.png`),
      },
    }))

    logger.info('SafePublicBeats retrieved')
    return NextResponse.json(
      {
        message: 'success',
        beats: beatsWithAssets,
      },
      { status: HttpStatus.http200ok },
    )
  } catch (error) {
    logger.error('Error getting public beat data: ', error)
    return NextResponse.json({ message: 'database error' }, { status: HttpStatus.http503serviceUnavailable })
  }
}
