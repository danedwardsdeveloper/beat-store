import { RegenerateResponsePOST } from '@/app/api/admin/regenerate/route'
import { PostCreateAccountBody, PostCreateAccountResponse } from '@/app/api/auth/create-account/route'
import { DeleteDeleteAccountResponse } from '@/app/api/auth/delete-account/route'
import { PostSignInBody, PostSignInResponse } from '@/app/api/auth/sign-in/route'
import { SignOutResponseGET } from '@/app/api/auth/sign-out/route'
import { ValidateTokenResponseGET } from '@/app/api/auth/validate-token/route'

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
    response: SignOutResponseGET
  }
  '/api/auth/delete-account': {
    response: DeleteDeleteAccountResponse
  }
  '/api/auth/validate-token': {
    response: ValidateTokenResponseGET
  }
  '/api/admin/regenerate': {
    response: RegenerateResponsePOST
  }
}
