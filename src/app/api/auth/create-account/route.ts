import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { createCookieOptions, generateTokenPayload, jwtSecret } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { SafeUser } from '@/app/api/types'

export interface PostCreateAccountBody {
  email: string
  password: string
  firstName: string
  lastName: string
  marketingEmails: boolean
}

export interface PostCreateAccountResponse {
  message:
    | 'email missing'
    | 'password missing'
    | 'firstName missing'
    | 'lastName missing'
    | 'marketingEmails missing'
    | 'email already registered'
    | 'success'
    | 'server error'
  user?: SafeUser
}

export async function POST(req: NextRequest): Promise<NextResponse<PostCreateAccountResponse>> {
  try {
    const body: PostCreateAccountBody = await req.json()
    const { email, password, firstName, lastName, marketingEmails } = body

    switch (true) {
      case !email:
        return NextResponse.json({ message: 'email missing' }, { status: 400 })
      case !password:
        return NextResponse.json({ message: 'password missing' }, { status: 400 })
      case !firstName:
        return NextResponse.json({ message: 'firstName missing' }, { status: 400 })
      case !lastName:
        return NextResponse.json({ message: 'lastName missing' }, { status: 400 })
      case !marketingEmails:
        return NextResponse.json({ message: 'marketingEmails missing' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'email already registered' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
        marketingEmails,
        role: 'customer',
        confirmationStatus: 'pending',
        confirmationToken: crypto.randomUUID(),
      },
      select: {
        id: true,
        firstName: true,
        role: true,
      },
    })

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
          id: user.id,
          firstName: user.firstName,
          role: user.role,
        },
      } as PostCreateAccountResponse,
      {
        status: 200,
      },
    )

    response.cookies.set(accessCookie)
    response.cookies.set(refreshCookie)

    // Send confirmation email

    return response
  } catch (error) {
    logger.error('Server error: ', error)
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}
