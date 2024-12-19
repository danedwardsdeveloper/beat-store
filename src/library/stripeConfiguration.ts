import Stripe from 'stripe'

import { requireEnv } from '@/library/environment'

export type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem

export const endpointSecret = requireEnv('STRIPE_WEBHOOK_SECRET')

const useRealMoney = false
const stripeSecretKey = requireEnv('STRIPE_SECRET_KEY')
const stripeSecretTestKey = requireEnv('STRIPE_SECRET_TEST_KEY')
export const stripeDynamicSecretKey = useRealMoney ? stripeSecretKey : stripeSecretTestKey

export const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
})
