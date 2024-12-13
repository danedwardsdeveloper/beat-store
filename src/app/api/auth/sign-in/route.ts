import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { createCookieOptions, jwtSecret } from '@/library/cookies'
import { generateTokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { SafeUser } from '@/app/api/types'

export interface PostSignInBody {
  email: string
  password: string
}

export interface PostSignInResponse {
  message:
    | 'email missing'
    | 'password missing'
    | 'user not found'
    | 'invalid credentials'
    | 'success'
    | 'server error'
  user?: SafeUser
}

export async function POST(req: NextRequest): Promise<NextResponse<PostSignInResponse>> {
  try {
    const body: PostSignInBody = await req.json()
    const { email, password } = body

    if (!email) {
      return NextResponse.json({ message: 'email missing' }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ message: 'password missing' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        hashedPassword: true,
        role: true,
        confirmationStatus: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'user not found' }, { status: 401 })
    }

    const passwordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!passwordValid) {
      return NextResponse.json({ message: 'server error' }, { status: 401 })
    }

    const accessPayload = generateTokenPayload('access_token', user.id)
    const accessToken = jwt.sign(accessPayload, jwtSecret)

    const refreshPayload = generateTokenPayload('refresh_token', user.id)
    const refreshToken = jwt.sign(refreshPayload, jwtSecret)

    const accessCookie = createCookieOptions('access_token', accessToken)
    const refreshCookie = createCookieOptions('refresh_token', refreshToken)

    const response = NextResponse.json(
      {
        message: 'success',
        user: {
          role: user.role,
          confirmationStatus: user.confirmationStatus,
        },
      } as PostSignInResponse,
      {
        status: 200,
      },
    )

    response.cookies.set(accessCookie)
    response.cookies.set(refreshCookie)

    return response
  } catch (error) {
    logger.error('Server error: ', error)
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}
