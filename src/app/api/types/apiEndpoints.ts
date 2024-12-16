import { RegenerateResponsePOST } from '@/app/api/admin/regenerate/route'
import { CreateAccountBodyPOST, CreateAccountResponsePOST } from '@/app/api/auth/create-account/route'
import { DeleteAccountResponseDELETE } from '@/app/api/auth/delete-account/route'
import { SignInBodyPOST, SignInResponsePOST } from '@/app/api/auth/sign-in/route'
import { SignOutResponseGET } from '@/app/api/auth/sign-out/route'
import { ValidateTokenResponseGET } from '@/app/api/auth/validate-token/route'

export const apiPaths = Object.freeze(
  Object.fromEntries(Object.keys({} as ApiEndpoints).map(key => [key, key])),
) as { [K in keyof ApiEndpoints]: K }

export interface ApiEndpoints {
  // AUTH
  '/api/auth/create-account': {
    body: CreateAccountBodyPOST
    response: CreateAccountResponsePOST
  }
  '/api/auth/sign-in': {
    body: SignInBodyPOST
    response: SignInResponsePOST
  }
  '/api/auth/sign-out': {
    response: SignOutResponseGET
  }
  '/api/auth/delete-account': {
    response: DeleteAccountResponseDELETE
  }
  '/api/auth/validate-token': {
    response: ValidateTokenResponseGET
  }

  '/api/admin/regenerate': {
    response: RegenerateResponsePOST
  }
  '/api/admin/beats': {
    responseGET: null
    bodyGET: null

    responsePOST: null
    bodyPOST: null
  }
}
