import { NextRequest, NextResponse } from 'next/server'

import { CookieName } from '@/library/cookies'
import logger from '@/library/logger'

import validateToken, { TokenValidationResponse } from '../validateToken'
import { HttpStatus } from '@/app/api/types/httpStatus'

export interface ValidateTokenResponseGET extends TokenValidationResponse {
  message: 'token missing' | 'invalid token' | 'user not found' | 'success'
}

export async function GET(request: NextRequest): Promise<NextResponse<ValidateTokenResponseGET>> {
  const accessToken = request.cookies.get('token' as CookieName)?.value

  if (!accessToken) {
    logger.info('Access token not found')
    return NextResponse.json(
      { message: 'token missing', isValid: false },
      { status: HttpStatus.http401unauthorised },
    )
  }

  const { isValid, user } = await validateToken(accessToken)

  if (!isValid) {
    logger.info('Invalid access token provided')
    return NextResponse.json(
      { message: 'invalid token', isValid: false },
      { status: HttpStatus.http401unauthorised },
    )
  }

  if (!user) {
    logger.info('Token valid but no user data found')
    return NextResponse.json(
      { message: 'user not found', isValid: false },
      { status: HttpStatus.http401unauthorised },
    )
  }

  return NextResponse.json(
    {
      message: 'success',
      isValid: true,
      user,
    } as ValidateTokenResponseGET,
    { status: HttpStatus.http200ok },
  )
}
