import { NextRequest, NextResponse } from 'next/server'
import stripe, { Stripe } from 'stripe'

import protectedRoute from '@/library/auth/protectedRoute'
import prisma from '@/library/database/prisma'
import { endpointSecret } from '@/library/environment/privateVariables'
import logger from '@/library/misc/logger'

import { BasicMessages, HttpStatus } from '@/types'

export interface WebhookResponsePOST {
  message:
    | BasicMessages //
    | 'stripe-signature header missing'
    | 'invalid webhook'
    | 'webhook error'
  received: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse<WebhookResponsePOST>> {
  return protectedRoute<WebhookResponsePOST>(
    request,
    'bypass authorisation',
    'require confirmation',
    async () => {
      try {
        const payload = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
          logger.error('stripe-signature not found in header')
          return NextResponse.json(
            { message: 'stripe-signature header missing', received: false },
            { status: HttpStatus.http401unauthorised },
          )
        }

        let event: Stripe.Event

        try {
          event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
        } catch (error) {
          if (error instanceof Stripe.errors.StripeError) {
            logger.error(`Stripe Webhook Error: ${error.message}`)
            return NextResponse.json(
              { message: 'webhook error', received: false },
              { status: HttpStatus.http400badRequest },
            )
          }
          const errorMessage = error instanceof Error ? error.message : 'Unknown webhook error'
          logger.error(errorMessage)
          return NextResponse.json(
            { message: 'invalid webhook', received: false },
            { status: HttpStatus.http400badRequest },
          )
        }

        const paidInFull = event.type === 'checkout.session.completed'

        if (paidInFull) {
          const session = event.data.object as Stripe.Checkout.Session
          const purchasedItems = prisma.order.update({
            where: {
              id: session.id,
            },
            data: {
              status: 'PAID',
            },
          })
          if (!purchasedItems) {
          }
        }

        // Error handling for successful payment but failure to transfer ownership

        return NextResponse.json(
          {
            message: 'success',
            received: true,
          },
          { status: HttpStatus.http200ok },
        )
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown server error'
        logger.error('Webhook error:', errorMessage)
        return NextResponse.json(
          { message: 'server error', received: false },
          { status: HttpStatus.http500serverError },
        )
      }
    },
  )
}
