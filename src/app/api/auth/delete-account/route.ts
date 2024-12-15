import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName, createClearCookieOptions, jwtSecret, TokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

export interface DeleteDeleteAccountResponse {
  message:
    | 'success' //
    | 'token missing'
    | 'invalid token'
    | 'user not found'
    | 'db error'
    | 'server error'
}

export async function DELETE(request: NextRequest): Promise<NextResponse<DeleteDeleteAccountResponse>> {
  try {
    const token = request.cookies.get('token' as CookieName)?.value

    if (!token) {
      logger.info('Token missing')
      return NextResponse.json({ message: 'token missing' }, { status: 401 })
    }

    let decoded: TokenPayload
    try {
      decoded = jwt.verify(token, jwtSecret) as TokenPayload
    } catch (error) {
      logger.error('Invalid token error: ', error)
      return NextResponse.json({ message: 'invalid token' }, { status: 401 })
    }

    try {
      await prisma.user.delete({
        where: { id: decoded.sub },
      })
    } catch (error) {
      logger.error('Database error while trying to delete account: ', error)
      return NextResponse.json({ message: 'db error' }, { status: 500 })
    }

    const response = NextResponse.json(
      { message: 'success' } as DeleteDeleteAccountResponse, //
      { status: 200 },
    )
    response.cookies.set('token' as CookieName, '', createClearCookieOptions())

    return response
  } catch (error) {
    logger.error('Delete account error:', error)
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}
