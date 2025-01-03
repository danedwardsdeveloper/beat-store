import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { CookieDurations, createCookieOptions, generateTokenPayload } from '@/library/auth/cookies'
import prisma from '@/library/database/prisma'
import { jwtSecret } from '@/library/environment/privateVariables'
import logger from '@/library/misc/logger'

import { HttpStatus, SafeUser } from '@/types'

export interface SignInPOSTbody {
  email: string
  password: string
  staySignedIn: boolean
}

export interface SignInPOSTresponse {
  message:
    | 'firstName missing'
    | 'email missing'
    | 'password missing'
    | 'invalid credentials'
    | 'success'
    | 'server error'
  user?: SafeUser
}

export async function POST(request: NextRequest): Promise<NextResponse<SignInPOSTresponse>> {
  try {
    const body: SignInPOSTbody = await request.json()
    const { email, password, staySignedIn } = body

    if (!email) {
      logger.error('Email missing')
      return NextResponse.json({ message: 'email missing' }, { status: HttpStatus.http400badRequest })
    }

    if (!password) {
      logger.error('Password missing')
      return NextResponse.json({ message: 'password missing' }, { status: HttpStatus.http400badRequest })
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
      logger.error('User not found: ', JSON.stringify(user))
      return NextResponse.json({ message: 'invalid credentials' }, { status: HttpStatus.http401unauthorised })
    }

    const passwordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!passwordValid) {
      logger.error('Incorrect password')
      return NextResponse.json({ message: 'invalid credentials' }, { status: HttpStatus.http401unauthorised })
    }

    const duration = staySignedIn ? CookieDurations.twoWeeks : CookieDurations.oneHour
    const tokenPayload = generateTokenPayload(user.id, duration)
    const signedToken = jwt.sign(tokenPayload, jwtSecret)
    const tokenCookie = createCookieOptions(signedToken, duration)

    // Sync local cart with database cart

    const response = NextResponse.json(
      {
        message: 'success',
        user: {
          role: user.role,
          confirmationStatus: user.confirmationStatus,
        },
      } as SignInPOSTresponse,
      {
        status: HttpStatus.http200ok,
      },
    )

    response.cookies.set(tokenCookie)

    const durationWording = staySignedIn ? 'Two-week' : 'One-hour'
    logger.info(`Sign in successful. ${durationWording} cookie created.`)
    return response
  } catch (error) {
    logger.error('Server error: ', error)
    return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
  }
}
