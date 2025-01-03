import { myPersonalEmail } from '@/library/environment/privateVariables'

import { SendEmailBody } from '../emailClient'
import { createParagraph } from '../htmlEmailComponents'
import { ContactPOSTbody } from '@/types'

export default function createContactFormNotification({
  firstName,
  email,
  message,
}: ContactPOSTbody): SendEmailBody {
  const senderDetails = `New message from ${firstName}, ${email}`
  const formattedHtml = `${createParagraph(senderDetails, 'semibold')}
    ${createParagraph(message)}`
  const formattedText = `${senderDetails}
${message}
Reply to: ${email}`.trim()

  return {
    to: myPersonalEmail,
    subject: `${firstName}: New contact form submission`,
    html: formattedHtml,
    text: formattedText,
  }
}
