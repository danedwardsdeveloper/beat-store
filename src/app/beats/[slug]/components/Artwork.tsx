import Image from 'next/image'

import { PublicBeatWithAssets } from '@/types'

export default function Artwork({ beat }: { beat: PublicBeatWithAssets }) {
  return (
    <Image
      src={beat.assetUrls.artworkFull}
      alt={beat.metaDescription}
      height={300}
      width={300}
      className="rounded-lg border border-slate-800"
    />
  )
}
