import { NextRequest, NextResponse } from 'next/server'

import { addAssets } from '@/library/beats/addAssets'
import { publicBeatSelect } from '@/library/beats/publicBeatSelect'
import prisma from '@/library/database/prisma'
import logger from '@/library/misc/logger'

import { BasicMessages, HttpStatus, PublicBeatWithAssets } from '@/app/api/types'

export interface BeatsSlugGET {
  message: BasicMessages | 'slug missing' | 'beat not found'
  beat?: PublicBeatWithAssets
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse<BeatsSlugGET>> {
  const { slug } = await params
  if (!slug) {
    return NextResponse.json({ message: 'slug missing' }, { status: HttpStatus.http400badRequest })
  }
  try {
    const foundBeat = await prisma.beat.findFirst({
      where: {
        slug,
        isDraft: false,
        isHidden: false,
        isExclusiveSold: false,
        releaseDate: {
          lte: new Date(),
        },
      },
      select: publicBeatSelect,
      orderBy: {
        releaseDate: 'desc',
      },
    })

    if (!foundBeat) {
      logger.error(`Beat for slug ${slug} not found`)
      return NextResponse.json({ message: 'beat not found' }, { status: HttpStatus.http404notFound })
    }

    const foundBeatWithAssets = addAssets(foundBeat)

    logger.info('SafePublicBeats retrieved')
    return NextResponse.json(
      {
        message: 'success',
        beat: foundBeatWithAssets,
      },
      { status: HttpStatus.http200ok },
    )
  } catch (error) {
    logger.error('Error getting public beat data: ', error)
    return NextResponse.json({ message: 'database error' }, { status: HttpStatus.http503serviceUnavailable })
  }
}
