import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import logger from '@/library/logger'

import protectedRoute from '@/app/api/auth/protectedRoute'
import { BasicResponses, HttpStatus } from '@/app/api/types'

export interface RegenerateResponsePOST {
  message: BasicResponses | 'regeneration failed'
}

export async function POST(request: NextRequest): Promise<NextResponse<RegenerateResponsePOST>> {
  return protectedRoute<RegenerateResponsePOST>(request, 'admin', async () => {
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
  })
}
