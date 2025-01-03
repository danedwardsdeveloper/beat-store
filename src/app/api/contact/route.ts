import { NextResponse } from 'next/server'

import { sendEmail } from '@/library/email/emailClient'
import createContactFormNotification from '@/library/email/templates/contactFormNotification'
import logger from '@/library/misc/logger'

import { HttpStatus } from '@/types'
import { contactFormRequirements, ContactPOSTbody, ContactPOSTresponse } from '@/types'

export async function POST(request: Request): Promise<NextResponse<ContactPOSTresponse>> {
  try {
    const { firstName, email, message }: ContactPOSTbody = await request.json()

    if (!firstName || !email || !message) {
      return NextResponse.json({ message: 'missing input' }, { status: HttpStatus.http400badRequest })
    }

    if (firstName.length > contactFormRequirements.maxNameLength) {
      return NextResponse.json({ message: `name too long` }, { status: HttpStatus.http400badRequest })
    }

    if (message.length > contactFormRequirements.maxMessageLength) {
      return NextResponse.json({ message: 'message too long' }, { status: HttpStatus.http400badRequest })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'invalid email' }, { status: HttpStatus.http400badRequest })
    }

    const sanitisedData = {
      firstName: firstName
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[<>'";&]/g, ''),
      email: email.toLowerCase().trim(),
      message: message
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[<>'";&]/g, '')
        .replace(/\n/g, '<br>'),
    }

    const emailContent = createContactFormNotification({ firstName, email, message })
    const emailResponse = await sendEmail(emailContent)
    if (emailResponse.success) {
      logger.info('Contact form submission:', JSON.stringify(sanitisedData))
      return NextResponse.json({ message: 'success' }, { status: HttpStatus.http200ok })
    } else {
      logger.error('Error sending email to myself')
      return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
    }
  } catch (error) {
    logger.error('Contact form error:', error)
    return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
  }
}
