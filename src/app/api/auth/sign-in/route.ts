import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { createCookieOptions, jwtSecret } from '@/library/cookies'
import { generateTokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { SafeUser } from '@/app/api/types/safeUser'

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

    const tokenPayload = generateTokenPayload(user.id)
    const signedToken = jwt.sign(tokenPayload, jwtSecret)
    const tokenCookie = createCookieOptions(signedToken)

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

    response.cookies.set(tokenCookie)

    return response
  } catch (error) {
    logger.error('Server error: ', error)
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}
