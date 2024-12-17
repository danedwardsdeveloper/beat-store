import logger from '../logger'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    logger.error(`${name} missing`)
    throw new Error(`${name} missing`)
  }
  return value
}

export const awsAccessKey = requireEnv('AWS_ACCESS_KEY_ID')
export const awsSecretAccessKey = requireEnv('AWS_SECRET_ACCESS_KEY')

export const cfKeyPairId = requireEnv('CF_KEY_PAIR_ID')
export const cfPrivateKey = requireEnv('CF_PRIVATE_KEY')
export const cfDomain = requireEnv('CF_DOMAIN')
