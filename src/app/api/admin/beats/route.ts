import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import validateToken from '../../auth/validateToken'
import { AuthResponses, BasicResponses } from '../../types/responseMessages'
import { HttpStatus } from '@/app/api/types/httpStatus'

export interface AdminBeatsResponsePOST {
  message: BasicResponses | AuthResponses
  beatId?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<AdminBeatsResponsePOST>> {
  const accessToken = request.cookies.get('token' as CookieName)?.value

  if (!accessToken) {
    logger.info('Access token not found')
    return NextResponse.json({ message: 'token missing' }, { status: HttpStatus.http401unauthorised })
  }

  const { isValid, user } = await validateToken(accessToken)

  if (!isValid) {
    logger.info('Invalid token')
    return NextResponse.json({ message: 'invalid token' }, { status: HttpStatus.http401unauthorised })
  }

  if (!user) {
    logger.info('User not found')
    return NextResponse.json({ message: 'user not found' }, { status: HttpStatus.http404notFound })
  }

  if (user.role !== 'admin') {
    logger.info('Unauthorised regeneration attempt')
    return NextResponse.json({ message: 'unauthorised' }, { status: HttpStatus.http401unauthorised })
  }

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
    logger.error('Database error trying to create new empty beat', error)
    return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
  }
}

export interface AdminBeatsResponseGET {
  message: BasicResponses | AuthResponses
  beats?: Beat[]
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminBeatsResponseGET>> {
  const accessToken = request.cookies.get('token' as CookieName)?.value

  if (!accessToken) {
    logger.info('Access token not found')
    return NextResponse.json({ message: 'token missing' }, { status: HttpStatus.http401unauthorised })
  }

  const { isValid, user } = await validateToken(accessToken)

  if (!isValid) {
    logger.info('Invalid token')
    return NextResponse.json({ message: 'invalid token' }, { status: HttpStatus.http401unauthorised })
  }

  if (!user) {
    logger.info('User not found')
    return NextResponse.json({ message: 'user not found' }, { status: HttpStatus.http404notFound })
  }

  if (user.role !== 'admin') {
    logger.info('Unauthorised regeneration attempt')
    return NextResponse.json({ message: 'unauthorised' }, { status: HttpStatus.http401unauthorised })
  }

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
}
