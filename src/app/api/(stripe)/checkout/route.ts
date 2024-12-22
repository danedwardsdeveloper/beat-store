'use server'

import { NextRequest, NextResponse } from 'next/server'

import { dynamicBaseURL } from '@/library/environment/configuration'
import { stripeClient, StripeLineItem } from '@/library/stripeConfiguration'

import protectedRoute from '../../protectedRoute'
import { BasicMessages, HttpStatus } from '@/app/api/types'

export interface CheckoutResponsePOST {
  message: BasicMessages | 'empty cart'
  sessionId?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponsePOST>> {
  return protectedRoute<CheckoutResponsePOST>(
    request,
    'bypass authorisation',
    'require confirmation',
    async authenticatedSafeUser => {
      const orderContainsItems = true

      if (!orderContainsItems) {
        return NextResponse.json(
          {
            message: 'empty cart',
          },
          { status: HttpStatus.http400badRequest },
        )
      }

      // ToDo - implement actual logic
      const validLineItems: StripeLineItem[] = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Temp item title',
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ]

      if (validLineItems.length === 0) {
        return NextResponse.json(
          {
            message: 'empty cart',
          },
          { status: HttpStatus.http400badRequest },
        )
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: validLineItems,
        mode: 'payment',
        success_url: `${dynamicBaseURL}/thank-you`,
        cancel_url: `${dynamicBaseURL}/cancel`,
        client_reference_id: authenticatedSafeUser.id,
      })

      return NextResponse.json(
        { message: 'success', sessionId: session.id },
        {
          status: HttpStatus.http200ok,
        },
      )
    },
  )
}
