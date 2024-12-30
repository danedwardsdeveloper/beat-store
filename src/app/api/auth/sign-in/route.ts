import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { createCookieOptions, generateTokenPayload } from '@/library/auth/cookies'
import prisma from '@/library/database/prisma'
import { jwtSecret } from '@/library/environment/privateVariables'
import logger from '@/library/misc/logger'

import { SafeUser } from '@/types'

export interface SignInBodyPOST {
  email: string
  password: string
}

export interface SignInResponsePOST {
  message:
    | 'email missing'
    | 'password missing'
    | 'user not found'
    | 'invalid credentials'
    | 'success'
    | 'server error'
  user?: SafeUser
}

export async function POST(request: NextRequest): Promise<NextResponse<SignInResponsePOST>> {
  try {
    const body: SignInBodyPOST = await request.json()
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

    // Sync local cart with database cart

    const response = NextResponse.json(
      {
        message: 'success',
        user: {
          role: user.role,
          confirmationStatus: user.confirmationStatus,
        },
      } as SignInResponsePOST,
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
