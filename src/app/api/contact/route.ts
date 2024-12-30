import { NextResponse } from 'next/server'

import logger from '@/library/misc/logger'

import { BasicMessages, HttpStatus } from '@/types'

export interface ContactPOSTbody {
  firstName: string
  lastName: string
  email: string
  message: string
}

export const contactFormRequirements = {
  maxNameLength: 50,
  maxMessageLength: 1000,
}

export interface ContactPOSTresponse {
  message:
    | BasicMessages
    | 'missing input'
    | 'invalid input'
    | `name(s) too long`
    | 'message too long'
    | 'invalid email'
}

export async function POST(request: Request): Promise<NextResponse<ContactPOSTresponse>> {
  try {
    const { firstName, lastName, email, message }: ContactPOSTbody = await request.json()

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ message: 'missing input' }, { status: HttpStatus.http400badRequest })
    }

    if (
      firstName.length > contactFormRequirements.maxNameLength ||
      lastName.length > contactFormRequirements.maxNameLength
    ) {
      return NextResponse.json({ message: `name(s) too long` }, { status: HttpStatus.http400badRequest })
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
      lastName: lastName
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[<>'";&]/g, ''),
      email: email.toLowerCase().trim(),
      message: message
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[<>'";&]/g, ''),
    }

    // Send email to myself
    logger.info('Contact form submission:', JSON.stringify(sanitisedData))

    return NextResponse.json({ message: 'success' }, { status: HttpStatus.http200ok })
  } catch (error) {
    logger.error('Contact form error:', error)
    return NextResponse.json({ message: 'server error' }, { status: HttpStatus.http500serverError })
  }
}
