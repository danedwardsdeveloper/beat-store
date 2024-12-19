import { requireEnv } from '../environment'

export const awsAccessKey = requireEnv('AWS_ACCESS_KEY_ID')
export const awsSecretAccessKey = requireEnv('AWS_SECRET_ACCESS_KEY')

export const cfKeyPairId = requireEnv('CF_KEY_PAIR_ID')
export const cfPrivateKey = requireEnv('CF_PRIVATE_KEY')
export const cfDomain = requireEnv('CF_DOMAIN')
