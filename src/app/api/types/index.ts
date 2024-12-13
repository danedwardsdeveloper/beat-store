import { ConfirmationStatus, UserRole } from '@prisma/client'

import { PostCreateAccountBody, PostCreateAccountResponse } from '../auth/create-account/route'
import { DeleteDeleteAccountResponse } from '../auth/delete-account/route'
import { PostSignInBody, PostSignInResponse } from '../auth/sign-in/route'
import { GetSignOutResponse } from '../auth/sign-out/route'
import { GetValidateTokenResponse } from '../auth/validate-token/route'

export interface SafeUser {
  id: string
  firstName: string
  role: UserRole
  confirmationStatus: ConfirmationStatus
}

export interface ApiEndpoints {
  '/api/auth/create-account': {
    body: PostCreateAccountBody
    response: PostCreateAccountResponse
  }
  '/api/auth/sign-in': {
    body: PostSignInBody
    response: PostSignInResponse
  }
  '/api/auth/sign-out': {
    body: PostSignInBody
    response: GetSignOutResponse
  }
  '/api/auth/delete-account': {
    response: DeleteDeleteAccountResponse
  }
  '/api/auth/validate-token': {
    response: GetValidateTokenResponse
  }
}
