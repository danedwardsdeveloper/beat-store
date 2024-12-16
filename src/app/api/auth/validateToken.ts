import jwt from 'jsonwebtoken'

import { jwtSecret, TokenPayload } from '@/library/cookies'
import prisma from '@/library/database/prisma'
import logger from '@/library/logger'

import { SafeUser } from '@/app/api/types/safeUser'

export interface TokenValidationResponse {
  isValid: boolean
  user?: SafeUser
}

export default async function validateToken(accessToken: string): Promise<TokenValidationResponse> {
  try {
    const decoded = jwt.verify(accessToken, jwtSecret) as TokenPayload

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, firstName: true, role: true, confirmationStatus: true },
    })

    if (!existingUser) {
      logger.info(`User with id: ${decoded.sub} not found in database`)
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
