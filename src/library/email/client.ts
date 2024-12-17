import formData from 'form-data'
import Mailgun, { MailgunMessageData, MessagesSendResult } from 'mailgun.js'

import logger from '@/library/logger'

const mailgun = new Mailgun(formData)

const apiKey = process.env.MAILGUN_KEY

if (!apiKey) {
  throw new Error('MAILGUN_KEY missing')
}

const client = mailgun.client({
  username: 'api',
  key: apiKey,
  url: 'https://api.eu.mailgun.net',
})

interface EmailData {
  to: string
  subject: string
  text: string
  html: string
}

interface EmailResponse {
  success: boolean
  response?: MessagesSendResult
  error?: string
}

export const sendEmail = async ({ to, subject, text, html }: EmailData): Promise<EmailResponse> => {
  const messageData: MailgunMessageData = {
    from: 'Beat Store <mailgun@beatstore.co.uk>',
    to,
    subject,
    text,
    html,
  }

  try {
    const response = await client.messages.create('beatstore.co.uk', messageData)
    return { success: true, response }
  } catch (error) {
    logger.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unknown error',
    }
  }
}
