import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

import { createCookieOptions, generateTokenPayload, jwtSecret } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { SafeUser } from '@/app/api/types/safeUser'

export interface CreateAccountBodyPOST {
  email: string
  password: string
  firstName: string
  lastName: string
  marketingEmails: boolean
}

export interface CreateAccountResponsePOST {
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

export async function POST(req: NextRequest): Promise<NextResponse<CreateAccountResponsePOST>> {
  try {
    const body: CreateAccountBodyPOST = await req.json()
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

    const tokenPayload = generateTokenPayload(user.id)
    const signedToken = jwt.sign(tokenPayload, jwtSecret)
    const tokenCookie = createCookieOptions(signedToken)

    const response = NextResponse.json(
      {
        message: 'success',
        user: {
          id: user.id,
          firstName: user.firstName,
          role: user.role,
        },
      } as CreateAccountResponsePOST,
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
