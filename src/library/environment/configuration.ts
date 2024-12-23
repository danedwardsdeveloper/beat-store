export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

export const bareFlyDomain = 'beat-store.fly.dev'
export const bareCustomDomain = 'beatstore.co.uk'

export const productionBaseURL = `https://${bareCustomDomain}`
export const developmentBaseURL = 'http://localhost:3000'
export const dynamicBaseURL = isProduction ? productionBaseURL : developmentBaseURL

const productionAssetsBaseURL = `https://assets.${bareCustomDomain}`
const developmentAssetsBaseURL = 'https://d1ttulk89fbidl.cloudfront.net'
export const dynamicAssetsBaseURL = isProduction ? productionAssetsBaseURL : developmentAssetsBaseURL
