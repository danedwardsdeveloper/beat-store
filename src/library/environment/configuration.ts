import { requireVariable } from './requireVariable'

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

export const bareFlyDomain = 'beat-store.fly.dev'
export const bareCustomDomain = 'beatstore.co.uk'

export const productionBaseURL = `https://${bareCustomDomain}`
export const developmentBaseURL = 'http://localhost:3000'
export const dynamicBaseURL = isProduction ? productionBaseURL : developmentBaseURL

export const apiKey = requireVariable('MAILGUN_KEY')

export const jwtSecret = requireVariable('JWT_SECRET')

export const endpointSecret = requireVariable('STRIPE_WEBHOOK_SECRET')
export const stripeSecretKey = requireVariable('STRIPE_SECRET_KEY')
export const stripeSecretTestKey = requireVariable('STRIPE_SECRET_TEST_KEY')
export const useRealMoney = false
export const stripeDynamicSecretKey = useRealMoney ? stripeSecretKey : stripeSecretTestKey

export const awsAccessKey = requireVariable('AWS_ACCESS_KEY_ID')
export const awsSecretAccessKey = requireVariable('AWS_SECRET_ACCESS_KEY')

export const cloudfrontURL = requireVariable('CF_URL')
// export const cfKeyPairId = requireVariable('CF_KEY_PAIR_ID')
// export const cfPrivateKey = requireVariable('CF_PRIVATE_KEY')
// export const cfDomain = requireVariable('CF_DOMAIN')
