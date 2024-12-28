import { Beat } from '@prisma/client'

import { CheckoutResponsePOST } from '../../(stripe)/checkout/route'
import { WebhookResponsePOST } from '../../(stripe)/webhook/route'
import { BeatsSlugGET } from '../../published-beats/[slug]/route'
import { AdminBeatsAssetsBodyPOST } from '@/app/api/admin/beats/[beatId]/assets/route'
import { BeatsResponseDELETE, BeatsResponsePATCH } from '@/app/api/admin/beats/[beatId]/route'
import { AdminBeatsResponseGET, AdminBeatsResponsePOST } from '@/app/api/admin/beats/route'
import { RegenerateResponsePOST } from '@/app/api/admin/regenerate/route'
import { CreateAccountBodyPOST, CreateAccountResponsePOST } from '@/app/api/auth/create-account/route'
import { DeleteAccountResponseDELETE } from '@/app/api/auth/delete-account/route'
import { SignInBodyPOST, SignInResponsePOST } from '@/app/api/auth/sign-in/route'
import { BeatsGET } from '@/app/api/published-beats/route'

export interface ApiEndpoints {
  '/api/auth/create-account': {
    body: CreateAccountBodyPOST
    response: CreateAccountResponsePOST
  }
  '/api/auth/sign-in': {
    body: SignInBodyPOST
    response: SignInResponsePOST
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
  '/api/published-beats': {
    response: BeatsGET
  }
  '/api/published-beats/[slug]': {
    response: BeatsSlugGET
  }
  '/api/checkout': {
    response: CheckoutResponsePOST
  }
  '/api/webhook': {
    response: WebhookResponsePOST
  }
  '/api/orders': 'POST' // Create new generic order
  '/api/orders/[orderId]':
    | 'PUT' // Update existing order
    | 'GET' // Get order details
  '/api/customers/[customerId]/orders':
    | 'GET' // Get all orders for a customer
    | 'POST' // Create order for a specific customer
}
