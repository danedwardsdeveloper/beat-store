import { dynamicBaseURL } from '../environment/configuration'
import { PublicBeat, PublicBeatWithAssets } from '@/app/api/types'

export function addAssets(beat: PublicBeat): PublicBeatWithAssets {
  return {
    ...beat,
    assetUrls: {
      taggedMp3: `/images/${beat.id}/tagged.mp3`,
      artworkFull: `/images/${beat.id}/full.webp`,
      artworkThumb: `/images/${beat.id}/thumb.webp`,
      artworkSocial: `${dynamicBaseURL}/images/${beat.id}/social.png`,
    },
  }
}