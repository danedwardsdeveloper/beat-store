import { getSignedUrl } from '@aws-sdk/cloudfront-signer'

import { cfDomain, cfKeyPairId, cfPrivateKey } from './awsConfiguration'
// ToDo move this definition
import { AssetType } from '@/app/api/admin/beats/[beatIdentifier]/assets/route'

const thirtyMinutesInMilliseconds = 30 * 60 * 1000

export type SignedAssetType = Exclude<AssetType, 'image' | 'untaggedMp3'>

export function generateSignedURL(key: string, assetType: SignedAssetType) {
  const fileType = {
    taggedMp3: 'mp3',
    wav: 'wav',
    zippedStems: 'zip',
  }[assetType]

  const url = `https://${cfDomain}/${key}.${fileType}`
  const dateLessThan = new Date(Date.now() + thirtyMinutesInMilliseconds).toISOString()

  return getSignedUrl({
    url,
    keyPairId: cfKeyPairId,
    privateKey: cfPrivateKey,
    dateLessThan,
  })
}
