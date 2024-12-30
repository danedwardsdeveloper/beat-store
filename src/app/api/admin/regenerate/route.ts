import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import protectedRoute from '@/library/auth/protectedRoute'
import logger from '@/library/misc/logger'

import { BasicMessages, HttpStatus } from '@/types'

export interface RegenerateResponsePOST {
  message: BasicMessages | 'regeneration failed'
}

export async function POST(request: NextRequest): Promise<NextResponse<RegenerateResponsePOST>> {
  return protectedRoute<RegenerateResponsePOST>(request, 'admin', 'require confirmation', async () => {
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
