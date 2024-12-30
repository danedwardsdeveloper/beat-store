import Image from 'next/image'
import { notFound } from 'next/navigation'

import getPublishedBeats, { GetPublishedBeatsResponse } from '@/library/beats/getPublishedBeats'
import logger from '@/library/misc/logger'
import { generateBeatMetadata } from '@/library/misc/metadata'

export async function generateStaticParams() {
  try {
    const response = await getPublishedBeats()
    const { beats, message }: GetPublishedBeatsResponse = response

    if (!beats) {
      logger.warn('No beats found. ', message)
      return []
    } else {
      return beats.map(beat => ({
        slug: beat.slug,
      }))
    }
  } catch (error) {
    logger.error('Error in generateStaticParams: ', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { beat }: GetPublishedBeatsResponse = await getPublishedBeats({ slug: (await params).slug })
  if (!beat) return {}
  return generateBeatMetadata({ beat })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { beat }: GetPublishedBeatsResponse = await getPublishedBeats({ slug: (await params).slug })

  if (!beat) {
    notFound()
  }

  return (
    <div key={beat.slug}>
      <h2>Beat Page</h2>
      <p>{beat.title}</p>

      <h2>{`Description`}</h2>
      {beat.description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <Image
        src={beat.assetUrls.artworkFull}
        alt={beat.metaDescription}
        height={300}
        width={300}
        style={{ display: 'block' }}
      />
      <audio controls>
        <source src={beat.assetUrls.taggedMp3} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <Image
        src={beat.assetUrls.artworkThumb}
        alt={beat.metaDescription}
        height={100}
        width={100}
        style={{ display: 'block' }}
      />
    </div>
  )
}
