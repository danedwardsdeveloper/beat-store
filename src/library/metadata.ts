import { Metadata } from 'next'

import { PublicBeatWithAssets } from '@/app/api/types'

import { productionBaseURL } from './environment/publicVariables'

export const defaultMetaDescription =
  'Beat Store is a modern high-performance e-commerce website for selling beats. Get yours today.'

export function generateBeatMetadata({ beat }: { beat: PublicBeatWithAssets }): Metadata {
  const canonical = `${productionBaseURL}/beats/${beat.slug}`

  return {
    title: beat.metaTitle,
    description: beat.metaDescription,
    openGraph: {
      title: beat.metaTitle,
      description: beat.metaDescription,
      type: 'music.song',
      url: canonical,
      images: [
        {
          url: beat.assetUrls.artworkSocial,
          width: 1200,
          height: 630,
          alt: beat.metaTitle,
        },
      ],
      siteName: 'BeatStore',
    },
    alternates: {
      canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: beat.metaTitle,
      description: beat.metaDescription,
      images: [beat.assetUrls.artworkSocial],
    },
  }
}
