import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import protectedRoute from '@/app/api/auth/protectedRoute'
import { AuthResponses, BasicResponses, BeatMetadata, HttpStatus } from '@/app/api/types'

export interface BeatsResponseGET {
  message: BasicResponses | AuthResponses | 'beat not found'
  beat?: Beat
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ beatIdentifier: string }> },
): Promise<NextResponse<BeatsResponseGET>> {
  // TODO Undo temporary authorisation bypass
  return protectedRoute<BeatsResponseGET>(request, '', async () => {
    const { beatIdentifier } = await params
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(beatIdentifier)

      const beat = await prisma.beat.findFirst({
        where: isObjectId ? { id: beatIdentifier } : { slug: beatIdentifier },
      })

      if (!beat) {
        logger.info(`Beat with identifier ${beatIdentifier} not found`)
        return NextResponse.json({ message: 'beat not found' }, { status: HttpStatus.http404notFound })
      }

      logger.info('Beat retrieved successfully')
      return NextResponse.json(
        {
          message: 'success',
          beat,
        },
        {
          status: HttpStatus.http200ok,
        },
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
      logger.error('Database error:', { error: errorMessage })
      return NextResponse.json(
        { message: 'database error' },
        { status: HttpStatus.http503serviceUnavailable },
      )
    }
  })
}

export interface BeatsResponsePATCH {
  message: BasicResponses | AuthResponses | 'beat not found'
  updatedBeat?: Beat
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ beatIdentifier: string }> },
): Promise<NextResponse<BeatsResponsePATCH>> {
  // TODO Undo temporary authorisation bypass
  return protectedRoute<BeatsResponsePATCH>(request, '', async () => {
    const { beatIdentifier } = await params
    const body: BeatMetadata = await request.json()

    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(beatIdentifier)

      const existingBeat = await prisma.beat.findFirst({
        where: isObjectId ? { id: beatIdentifier } : { slug: beatIdentifier },
      })

      if (!existingBeat) {
        logger.info(`Beat with id ${beatIdentifier} not found`)
        return NextResponse.json({ message: 'beat not found' }, { status: HttpStatus.http404notFound })
      }

      // ToDo Check slug is unique

      const updatedBeat = await prisma.beat.update({
        where: {
          id: existingBeat.id,
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
      logger.error('Database error:', { error: errorMessage })
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
      logger.error('Database error:', { error: errorMessage })
      return NextResponse.json(
        { message: 'database error' },
        { status: HttpStatus.http503serviceUnavailable },
      )
    }
  })
}
