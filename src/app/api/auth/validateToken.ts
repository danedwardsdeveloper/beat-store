import jwt from 'jsonwebtoken'

import { jwtSecret, TokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { ValidateTokenGETresponse } from './validate-token/route'

export async function validateToken(accessToken: string): Promise<ValidateTokenGETresponse> {
  try {
    const decoded = jwt.verify(accessToken, jwtSecret) as TokenPayload

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, firstName: true, role: true, confirmationStatus: true },
    })

    if (!existingUser) {
      // logger
      return { isValid: false }
    }

    return {
      isValid: true,
      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        role: existingUser.role,
        confirmationStatus: existingUser.confirmationStatus,
      },
    }
  } catch (error) {
    logger.error('Error validating token: ', error)
    return { isValid: false }
  }
}
