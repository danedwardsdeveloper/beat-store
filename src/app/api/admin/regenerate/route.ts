import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { CookieName } from '@/library/cookies'
import logger from '@/library/logger'

import validateToken from '@/app/api/auth/validateToken'
import { HttpStatus } from '@/app/api/types/httpStatus'
import { AuthResponses, BasicResponses } from '@/app/api/types/responseMessages'

export interface RegenerateResponsePOST {
  message: BasicResponses | AuthResponses | 'regeneration failed'
}

export async function POST(request: NextRequest): Promise<NextResponse<RegenerateResponsePOST>> {
  const accessToken = request.cookies.get('token' as CookieName)?.value

  if (!accessToken) {
    logger.info('Access token not found')
    return NextResponse.json({ message: 'token missing' }, { status: HttpStatus.http401unauthorised })
  }

  const { isValid, user } = await validateToken(accessToken)

  if (!isValid) {
    logger.info('Invalid token')
    return NextResponse.json({ message: 'invalid token' }, { status: HttpStatus.http401unauthorised })
  }

  if (!user) {
    logger.info('User not found')
    return NextResponse.json({ message: 'user not found' }, { status: HttpStatus.http404notFound })
  }

  if (user.role !== 'admin') {
    logger.info('Unauthorised regeneration attempt')
    return NextResponse.json({ message: 'unauthorised' }, { status: HttpStatus.http401unauthorised })
  }

  try {
    revalidatePath('/')

    logger.info('Site regenerated successfully')
    return NextResponse.json(
      {
        message: 'success',
      },
      { status: HttpStatus.http200ok },
    )
  } catch (error) {
    console.error('Regeneration error:', error)
    return NextResponse.json({ message: 'regeneration failed' }, { status: HttpStatus.http500serverError })
  }
}
