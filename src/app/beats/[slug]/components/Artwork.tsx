import Image from 'next/image'

import { PublicBeatWithAssets } from '@/types'

export default function Artwork({ beat }: { beat: PublicBeatWithAssets }) {
  return (
    <Image
      src={beat.assetUrls.artworkFull}
      alt={beat.metaDescription}
      height={650}
      width={650}
      className="rounded-lg border border-slate-800"
    />
  )
}
