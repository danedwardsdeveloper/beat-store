import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import validateToken from '@/app/api/auth/validateToken'
import { HttpStatus } from '@/app/api/types/httpStatus'
import { AuthResponses, BasicResponses } from '@/app/api/types/responseMessages'

export interface BeatsResponsePATCH {
  message: BasicResponses | AuthResponses | 'beat not found'
  updatedBeat?: Beat
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<BeatsResponsePATCH>> {
  const { beatId } = await params
  const body: Beat = await request.json()

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
    logger.info('Unauthorised beat update attempt')
    return NextResponse.json({ message: 'unauthorised' }, { status: HttpStatus.http401unauthorised })
  }

  try {
    const existingBeat = await prisma.beat.findUnique({
      where: {
        id: beatId,
      },
    })

    if (!existingBeat) {
      logger.info(`Beat with id ${beatId} not found`)
      return NextResponse.json({ message: 'beat not found' }, { status: HttpStatus.http404notFound })
    }

    const updatedBeat = await prisma.beat.update({
      where: {
        id: beatId,
      },
      data: {
        ...body,
      },
    })

    logger.info('Beat updated successfully')
    return NextResponse.json(
      {
        message: 'success',
        updatedBeat,
      },
      {
        status: HttpStatus.http200ok,
      },
    )
  } catch (error) {
    logger.error('Database error: ', error)
    return NextResponse.json({ message: 'database error' }, { status: HttpStatus.http503serviceUnavailable })
  }
}
