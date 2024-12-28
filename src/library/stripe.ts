import Stripe from 'stripe'

import { stripeDynamicSecretKey } from './environment/privateVariables'

export type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem

export const stripeClient = new Stripe(stripeDynamicSecretKey, {
  apiVersion: '2024-12-18.acacia',
})
