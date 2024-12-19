import { UserRole } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName, jwtSecret, TokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { AuthMessages, BasicMessages, HttpStatus, SafeUser } from '@/app/api/types'

export default async function protectedRoute<T extends { message: AuthMessages | BasicMessages | string }>(
  request: NextRequest,
  requiredRole: UserRole | 'bypass authorisation',
  confirmationRequired: 'require confirmation' | 'allow unconfirmed',
  handler: (authenticatedSafeUser: SafeUser, authenticatedRequest: NextRequest) => Promise<NextResponse<T>>,
): Promise<NextResponse<T>> {
  try {
    const accessToken = request.cookies.get('token' as CookieName)?.value
    if (!accessToken) {
      logger.info('Access token not found')
      return NextResponse.json(
        { message: 'token missing' },
        {
          status: HttpStatus.http401unauthorised,
        },
      ) as NextResponse<T>
    }

    let decoded: TokenPayload
    try {
      decoded = jwt.verify(accessToken, jwtSecret) as TokenPayload
    } catch (error) {
      logger.info('JWT verification failed:', error)
      const message = error instanceof jwt.TokenExpiredError ? 'expired token' : 'invalid token'
      return NextResponse.json({ message }, { status: HttpStatus.http401unauthorised }) as NextResponse<T>
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, firstName: true, role: true, confirmationStatus: true },
    })

    if (!existingUser) {
      logger.info(`User with id: ${decoded.sub} not found in database`)
      return NextResponse.json(
        { message: 'user not found' },
        {
          status: HttpStatus.http404notFound,
        },
      ) as NextResponse<T>
    }

    if (requiredRole === 'bypass authorisation') {
      logger.info('Protected route bypassed')
      return handler(existingUser, request)
    }

    if (confirmationRequired === 'require confirmation' && existingUser.confirmationStatus !== 'confirmed') {
      logger.info(`User ${existingUser.id} attempted to access route without confirmation`)
      return NextResponse.json(
        { message: 'email not confirmed' },
        {
          status: HttpStatus.http403forbidden,
        },
      ) as NextResponse<T>
    }

    if (existingUser.role !== 'admin' && existingUser.role !== requiredRole) {
      logger.info(
        `User ${existingUser.id} with role ${existingUser.role} attempted to access ${requiredRole} endpoint`,
      )
      return NextResponse.json(
        { message: 'unauthorised' },
        {
          status: HttpStatus.http403forbidden,
        },
      ) as NextResponse<T>
    }

    return handler(existingUser, request)
  } catch (error) {
    logger.error('Error in protected route:', error instanceof Error ? error.message : 'Unknown server error')
    return NextResponse.json(
      { message: 'server error' },
      {
        status: HttpStatus.http500serverError,
      },
    ) as NextResponse<T>
  }
}
