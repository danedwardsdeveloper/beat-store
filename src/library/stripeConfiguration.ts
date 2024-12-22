import Stripe from 'stripe'

import { requireVariable } from '@/library/environment/requireVariable'

export type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem

export const endpointSecret = requireVariable('STRIPE_WEBHOOK_SECRET')

const useRealMoney = false
const stripeSecretKey = requireVariable('STRIPE_SECRET_KEY')
const stripeSecretTestKey = requireVariable('STRIPE_SECRET_TEST_KEY')
export const stripeDynamicSecretKey = useRealMoney ? stripeSecretKey : stripeSecretTestKey

export const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
})
