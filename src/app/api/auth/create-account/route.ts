import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { CookieDurations, createCookieOptions, generateTokenPayload } from '@/library/auth/cookies'
import prisma from '@/library/database/prisma'
import { jwtSecret } from '@/library/environment/privateVariables'
import logger from '@/library/misc/logger'

import { SignInPOSTbody } from '../sign-in/route'
import { BasicMessages, HttpStatus, SafeUser } from '@/types'

export interface CreateAccountPOSTbody extends SignInPOSTbody {
  firstName: string
  marketingEmails: boolean
}

export interface CreateAccountPOSTresponse {
  message:
    | BasicMessages
    | 'email missing'
    | 'password missing'
    | 'firstName missing'
    | 'invalid email format'
    | 'staySignedIn missing'
    | 'marketingEmails missing'
    | 'email already registered'

  user?: SafeUser
}

export async function POST(request: NextRequest): Promise<NextResponse<CreateAccountPOSTresponse>> {
  try {
    const body: CreateAccountPOSTbody = await request.json()
    const { email, password, firstName, marketingEmails, staySignedIn } = body

    switch (true) {
      case !email:
        return NextResponse.json({ message: 'email missing' }, { status: HttpStatus.http400badRequest })
      case !password:
        return NextResponse.json({ message: 'password missing' }, { status: HttpStatus.http400badRequest })
      case !firstName:
        return NextResponse.json({ message: 'firstName missing' }, { status: HttpStatus.http400badRequest })
      case !marketingEmails:
        return NextResponse.json(
          { message: 'marketingEmails missing' },
          { status: HttpStatus.http400badRequest },
        )
      case !staySignedIn:
        return NextResponse.json(
          { message: 'staySignedIn missing' },
          { status: HttpStatus.http400badRequest },
        )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'invalid email format' }, { status: HttpStatus.http400badRequest })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'email already registered' },
        { status: HttpStatus.http400badRequest },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
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

    const duration = staySignedIn ? CookieDurations.oneHour : CookieDurations.twoWeeks
    const tokenPayload = generateTokenPayload(user.id, duration)
    const signedToken = jwt.sign(tokenPayload, jwtSecret)
    const tokenCookie = createCookieOptions(signedToken, duration)

    // Sync local cart with database cart

    const response = NextResponse.json(
      {
        message: 'success',
        user: {
          id: user.id,
          firstName: user.firstName,
          role: user.role,
        },
      } as CreateAccountPOSTresponse,
      {
        status: 200,
      },
    )

    response.cookies.set(tokenCookie)

    // Send confirmation email

    return response
  } catch (error) {
    logger.error('Server error: ', error)
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}
