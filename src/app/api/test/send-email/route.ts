import { NextResponse } from 'next/server'

import { sendEmail } from '@/library/email/client'
import logger from '@/library/logger'

export async function GET() {
  try {
    const result = await sendEmail({
      to: 'daniel.edwards96@yahoo.com',
      subject: 'Test email',
      text: 'This is the text',
      html: '<h1>This is the text</h1>',
    })

    if (!result.success) {
      logger.error('Email send failed:', result.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    logger.error('Email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
