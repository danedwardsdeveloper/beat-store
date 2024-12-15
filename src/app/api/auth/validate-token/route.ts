import { NextRequest, NextResponse } from 'next/server'

import { CookieName } from '@/library/cookies'
import logger from '@/library/logger'

import { validateToken } from '../validateToken'
import { SafeUser } from '@/app/api/types'

export interface ValidateTokenGETresponse {
  isValid: boolean
  user?: SafeUser
}

export async function GET(req: NextRequest): Promise<NextResponse<ValidateTokenGETresponse>> {
  const accessToken = req.cookies.get('token' as CookieName)?.value

  if (!accessToken) {
    // logger
    return NextResponse.json({ isValid: false }, { status: 401 })
  }

  const { isValid, user } = await validateToken(accessToken)

  // Split into two clearer responses
  // logger
  return NextResponse.json(
    {
      isValid: isValid,
      user,
    } as ValidateTokenGETresponse,
    {
      status: isValid ? 200 : 401,
    },
  )
}
