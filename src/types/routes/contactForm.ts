import { BasicMessages } from '../definitions/responseMessages'

export interface ContactPOSTbody {
  firstName: string
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
    | 'name too long'
    | 'message too long'
    | 'invalid email'
}
