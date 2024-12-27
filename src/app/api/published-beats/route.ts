import { NextRequest, NextResponse } from 'next/server'

import { addAssets } from '@/library/beats/addAssets'
import { publicBeatSelect } from '@/library/beats/publicBeatSelect'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { BasicMessages, HttpStatus, PublicBeatWithAssets } from '@/app/api/types'

export interface BeatsGET {
  message: BasicMessages | 'no beats found'
  beats?: PublicBeatWithAssets[]
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
      select: publicBeatSelect,
      orderBy: {
        releaseDate: 'desc',
      },
    })

    const beatsWithAssets: PublicBeatWithAssets[] = activeBeats.map(beat => addAssets(beat))
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
