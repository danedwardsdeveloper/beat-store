import { dynamicBaseURL } from '@/library/environment/publicVariables'

import { PublicBeat, PublicBeatWithAssets } from '@/types'

export function addAssets(beat: PublicBeat): PublicBeatWithAssets {
  return {
    ...beat,
    assetUrls: {
      taggedMp3: `/audio/${beat.id}/tagged.mp3`,
      artworkFull: `/images/${beat.id}/full.webp`,
      artworkThumb: `/images/${beat.id}/thumb.webp`,
      artworkSocial: `${dynamicBaseURL}/images/${beat.id}/social.png`,
    },
  }
}
