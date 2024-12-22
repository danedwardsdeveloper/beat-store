import { requireVariable } from '@/library/environment/requireVariable'

export const awsAccessKey = requireVariable('AWS_ACCESS_KEY_ID')
export const awsSecretAccessKey = requireVariable('AWS_SECRET_ACCESS_KEY')

// export const cfKeyPairId = requireVariable('CF_KEY_PAIR_ID')
// export const cfPrivateKey = requireVariable('CF_PRIVATE_KEY')
// export const cfDomain = requireVariable('CF_DOMAIN')
