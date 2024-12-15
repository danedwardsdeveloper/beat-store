import { ConfirmationStatus, UserRole } from '@prisma/client'

import { PostRegenerateBody, PostRegenerateResponse } from '../admin/regenerate/route'
import { PostCreateAccountBody, PostCreateAccountResponse } from '../auth/create-account/route'
import { DeleteDeleteAccountResponse } from '../auth/delete-account/route'
import { PostSignInBody, PostSignInResponse } from '../auth/sign-in/route'
import { GetSignOutResponse } from '../auth/sign-out/route'
import { ValidateTokenGETresponse } from '../auth/validate-token/route'

export interface SafeUser {
  id: string
  firstName: string
  role: UserRole
  confirmationStatus: ConfirmationStatus
}

export const apiPaths = Object.freeze(
  Object.fromEntries(Object.keys({} as ApiEndpoints).map(key => [key, key])),
) as { [K in keyof ApiEndpoints]: K }

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
    response: ValidateTokenGETresponse
  }
  '/api/admin/regenerate': {
    body: PostRegenerateBody
    response: PostRegenerateResponse
  }
}
