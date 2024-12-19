import logger from './logger'

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

export const bareFlyDomain = 'beat-store.fly.dev'
export const bareCustomDomain = 'beatstore.co.uk'
export const productionBaseURL = `https://${bareCustomDomain}`
export const developmentBaseURL = 'http://localhost:3000'
export const dynamicBaseURL = isProduction ? productionBaseURL : developmentBaseURL

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    logger.error(`${name} missing`)
    throw new Error(`${name} missing`)
  }
  return value
}
