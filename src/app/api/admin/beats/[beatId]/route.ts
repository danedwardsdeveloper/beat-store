import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/auth/protectedRoute'
import { BasicResponses, HttpStatus } from '@/app/api/types'

export interface BeatsResponsePATCH {
  message: BasicResponses | 'beat not found'
  updatedBeat?: Beat
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<BeatsResponsePATCH>> {
  return protectedRoute<BeatsResponsePATCH>(request, 'admin', async () => {
    const { beatId } = await params
    const body: Beat = await request.json()
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
      return NextResponse.json(
        { message: 'database error' },
        { status: HttpStatus.http503serviceUnavailable },
      )
    }
  })
}

export interface BeatsResponseDELETE {
  message: BasicResponses | 'beat not found'
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<BeatsResponseDELETE>> {
  return protectedRoute<BeatsResponseDELETE>(request, 'admin', async () => {
    const { beatId } = await params
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

      await prisma.beat.delete({
        where: {
          id: beatId,
        },
      })
      return NextResponse.json({ message: 'success' }, { status: HttpStatus.http200ok })
    } catch (error) {
      logger.error('Database error: ', error)
      return NextResponse.json(
        { message: 'database error' },
        { status: HttpStatus.http503serviceUnavailable },
      )
    }
  })
}
