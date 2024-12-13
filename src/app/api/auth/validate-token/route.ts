import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName, jwtSecret, TokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { SafeUser } from '@/app/api/types'

export interface GetValidateTokenResponse {
  tokenValid: boolean
  user?: SafeUser
}

export async function GET(req: NextRequest): Promise<NextResponse<GetValidateTokenResponse>> {
  try {
    const accessToken = req.cookies.get('access_token' as CookieName)?.value

    if (!accessToken) {
      return NextResponse.json({ tokenValid: false }, { status: 401 })
    }

    const decoded = jwt.verify(accessToken, jwtSecret) as TokenPayload

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { role: true, confirmationStatus: true },
    })

    if (!existingUser) {
      return NextResponse.json({ tokenValid: false }, { status: 401 })
    }

    return NextResponse.json({
      tokenValid: true,
      user: {
        role: existingUser.role,
        confirmationStatus: existingUser.confirmationStatus,
      },
    } as GetValidateTokenResponse)
  } catch (error) {
    logger.error('Error validating token: ', error)
    return NextResponse.json({ tokenValid: false }, { status: 401 })
  }
}
