import { Beat } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import protectedRoute from '@/library/auth/protectedRoute'
import prisma from '@/library/database/prisma'
import logger from '@/library/misc/logger'

import { AuthMessages, BasicMessages, BeatMetadata, HttpStatus } from '@/types'

export interface BeatsResponseGET {
  message: BasicMessages | AuthMessages | 'beat not found'
  beat?: Beat
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<BeatsResponseGET>> {
  return protectedRoute<BeatsResponseGET>(request, 'admin', 'allow unconfirmed', async () => {
    const { beatId } = await params
    try {
      const beat = await prisma.beat.findFirst({
        where: { id: beatId },
      })

      if (!beat) {
        logger.info(`Beat with identifier ${beatId} not found`)
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
  message: BasicMessages | AuthMessages | 'beat not found' | 'slug not unique'
  updatedBeat?: Beat
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<BeatsResponsePATCH>> {
  return protectedRoute<BeatsResponsePATCH>(request, 'admin', 'allow unconfirmed', async () => {
    const { beatId } = await params
    const body: BeatMetadata = await request.json()

    try {
      const existingBeat = await prisma.beat.findFirst({
        where: { id: beatId },
      })

      if (!existingBeat) {
        logger.info(`Beat with id ${beatId} not found`)
        return NextResponse.json({ message: 'beat not found' }, { status: HttpStatus.http404notFound })
      }

      if (body.slug && body.slug !== existingBeat.slug) {
        const slugExists = await prisma.beat.findFirst({
          where: {
            slug: body.slug,
            id: {
              not: existingBeat.id,
            },
          },
        })

        if (slugExists) {
          logger.info(`Slug ${body.slug} is already in use`)
          return NextResponse.json({ message: 'slug not unique' }, { status: HttpStatus.http400badRequest })
        }
      }

      const updatedBeat = await prisma.beat.update({
        where: {
          id: existingBeat.id,
        },
        data: {
          ...body,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          metaTitle: true,
          description: true,
          metaDescription: true,
          isHidden: true,
          isDraft: true,
          releaseDate: true,
          basicSales: true,
          premiumSales: true,
          unlimitedSales: true,
          isExclusiveSold: true,
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
          originalArtworkFileName: true,
          taggedMp3: true,
          untaggedMp3: true,
          wav: true,
          stems: true,
          playCount: true,
          favouriteCount: true,
          favouritedByIds: true,
          favouritedBy: true,
          createdAt: true,
          updatedAt: true,
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
  message: BasicMessages | 'beat not found'
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ beatId: string }> },
): Promise<NextResponse<BeatsResponseDELETE>> {
  return protectedRoute<BeatsResponseDELETE>(request, 'admin', 'allow unconfirmed', async () => {
    const { beatId } = await params
    try {
      const existingBeat = await prisma.beat.findFirst({
        where: { id: beatId },
      })
      if (!existingBeat) {
        logger.info(`Beat with id ${beatId} not found`)
        return NextResponse.json({ message: 'beat not found' }, { status: HttpStatus.http404notFound })
      }

      await prisma.beat.delete({
        where: {
          id: existingBeat.id,
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
