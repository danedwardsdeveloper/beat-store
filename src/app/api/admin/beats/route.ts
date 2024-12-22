import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/protectedRoute'
import { AuthMessages, BasicMessages, HttpStatus } from '@/app/api/types'

export interface AdminBeatsResponsePOST {
  message: BasicMessages | AuthMessages
  beatId?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<AdminBeatsResponsePOST>> {
  logger.debug('New beat route called')
  return protectedRoute<AdminBeatsResponsePOST>(request, 'admin', 'allow unconfirmed', async () => {
    try {
      const newBeat = await prisma.beat.create({
        data: {},
        select: {
          id: true,
        },
      })

      logger.info('New beat template created with ID: ', newBeat.id)
      return NextResponse.json(
        { message: 'success', beatId: newBeat.id },
        { status: HttpStatus.http201created },
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
      logger.error('Database error trying to create new empty beat', { error: errorMessage })
      return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
    }
  })
}

export interface AdminBeatsResponseGET {
  message: BasicMessages
  beats?: Beat[]
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminBeatsResponseGET>> {
  return protectedRoute<AdminBeatsResponseGET>(request, 'admin', 'allow unconfirmed', async () => {
    try {
      const allBeats = await prisma.beat.findMany({
        orderBy: {
          releaseDate: 'desc',
        },
      })

      return NextResponse.json({
        message: 'success',
        beats: allBeats,
      })
    } catch (error) {
      logger.error('Error retrieving all beats: ', error)
      return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
    }
  })
}
