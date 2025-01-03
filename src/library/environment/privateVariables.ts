import { requireVariable } from './requireVariable'

export const mailgunKey = requireVariable('MAILGUN_KEY')

export const jwtSecret = requireVariable('JWT_SECRET')

export const myPersonalEmail = requireVariable('MY_PERSONAL_EMAIL')

export const endpointSecret = requireVariable('STRIPE_WEBHOOK_SECRET')
export const stripeSecretKey = requireVariable('STRIPE_SECRET_KEY')
export const stripeSecretTestKey = requireVariable('STRIPE_SECRET_TEST_KEY')
export const useRealMoney = false
export const stripeDynamicSecretKey = useRealMoney ? stripeSecretKey : stripeSecretTestKey

export const awsAccessKey = requireVariable('AWS_ACCESS_KEY_ID')
export const awsSecretAccessKey = requireVariable('AWS_SECRET_ACCESS_KEY')

export const cfKeyPairId = requireVariable('CF_KEY_PAIR_ID')
export const cfPrivateKey = requireVariable('CF_PRIVATE_KEY')
export const cfDomain = requireVariable('CF_DOMAIN')
export const cfUrl = requireVariable('CF_URL')
