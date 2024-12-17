import { Beat } from '@prisma/client'

import { AdminBeatsAssetsBodyPOST } from '@/app/api/admin/beats/[beatId]/assets/route'
import { BeatsResponseDELETE, BeatsResponsePATCH } from '@/app/api/admin/beats/[beatId]/route'
import { AdminBeatsResponseGET, AdminBeatsResponsePOST } from '@/app/api/admin/beats/route'
import { RegenerateResponsePOST } from '@/app/api/admin/regenerate/route'
import { CreateAccountBodyPOST, CreateAccountResponsePOST } from '@/app/api/auth/create-account/route'
import { DeleteAccountResponseDELETE } from '@/app/api/auth/delete-account/route'
import { SignInBodyPOST, SignInResponsePOST } from '@/app/api/auth/sign-in/route'
import { SignOutResponseGET } from '@/app/api/auth/sign-out/route'
import { BeatsGET } from '@/app/api/beats/route'

export const apiPaths = Object.freeze(
  Object.fromEntries(Object.keys({} as ApiEndpoints).map(key => [key, key])),
) as { [K in keyof ApiEndpoints]: K }

export interface ApiEndpoints {
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
  '/api/admin/regenerate': {
    response: RegenerateResponsePOST
  }
  '/api/admin/beats': {
    static: {
      responsePOST: AdminBeatsResponsePOST
      responseGET: AdminBeatsResponseGET
    }
    dynamic: {
      withId: (beatId: string) => `/api/admin/beats/${string}`
      bodyPATCH: Beat
      responsePATCH: BeatsResponsePATCH
      responseDELETE: BeatsResponseDELETE
      '/assets': {
        body: AdminBeatsAssetsBodyPOST
        response: AdminBeatsAssetsBodyPOST
      }
    }
  }
  '/api/beats': {
    response: BeatsGET
  }
}
