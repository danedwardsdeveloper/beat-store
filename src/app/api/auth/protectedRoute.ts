import { UserRole } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName, jwtSecret, TokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { AuthResponses, BasicResponses, HttpStatus, SafeUser } from '@/app/api/types'

export default async function protectedRoute<T>(
  request: NextRequest,
  requiredRole: UserRole,
  handler: (request: NextRequest, user: SafeUser) => Promise<NextResponse<T>>,
): Promise<NextResponse<T>> {
  try {
    const accessToken = request.cookies.get('token' as CookieName)?.value

    if (!accessToken) {
      logger.info('Access token not found')
      return NextResponse.json({ message: 'token missing' as BasicResponses } as T, {
        status: HttpStatus.http401unauthorised,
      })
    }

    let decoded: TokenPayload
    try {
      decoded = jwt.verify(accessToken, jwtSecret) as TokenPayload
    } catch (error) {
      logger.info('JWT verification failed:', error)
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ message: 'expired token' as AuthResponses } as T, {
          status: HttpStatus.http401unauthorised,
        })
      }
      return NextResponse.json({ message: 'invalid token' as AuthResponses } as T, {
        status: HttpStatus.http401unauthorised,
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, firstName: true, role: true, confirmationStatus: true },
    })

    if (!existingUser) {
      logger.info(`User with id: ${decoded.sub} not found in database`)
      return NextResponse.json({ message: 'user not found' as AuthResponses } as T, {
        status: HttpStatus.http404notFound,
      })
    }

    if (existingUser.role !== 'admin' && existingUser.role !== requiredRole) {
      logger.info(
        `User ${existingUser.id} with role ${existingUser.role} attempted to access ${requiredRole} endpoint`,
      )
      return NextResponse.json({ message: 'unauthorised' as AuthResponses } as T, {
        status: HttpStatus.http401unauthorised,
      })
    }

    return handler(request, {
      id: existingUser.id,
      firstName: existingUser.firstName,
      role: existingUser.role,
      confirmationStatus: existingUser.confirmationStatus,
    })
  } catch (error) {
    logger.error('Error in protected route: ', error)
    return NextResponse.json({ message: 'server error' as AuthResponses } as T, {
      status: HttpStatus.http500serverError,
    })
  }
}
