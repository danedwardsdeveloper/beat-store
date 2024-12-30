import { NextRequest, NextResponse } from 'next/server'

import getPublishedBeats from '@/library/beats/getPublishedBeats'
import logger from '@/library/misc/logger'

import { BasicMessages, HttpStatus, PublicBeatWithAssets } from '@/types'

export interface PublishedBeatsGETresponse {
  message: BasicMessages | 'no beats found'
  beats?: PublicBeatWithAssets[]
}

export async function GET(request: NextRequest): Promise<NextResponse<PublishedBeatsGETresponse>> {
  try {
    const response = getPublishedBeats()
    const { message, beats } = await response

    if (!beats) {
      logger.error('No beats found.', message)
      return NextResponse.json({
        message: 'no beats found',
      })
    }

    logger.info('SafePublicBeats retrieved')
    return NextResponse.json(
      {
        message: 'success',
        beats,
      },
      { status: HttpStatus.http200ok },
    )
  } catch (error) {
    logger.error('Error getting public beat data: ', error)
    return NextResponse.json({ message: 'database error' }, { status: HttpStatus.http503serviceUnavailable })
  }
}
