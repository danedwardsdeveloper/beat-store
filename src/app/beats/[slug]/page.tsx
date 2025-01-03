import { notFound } from 'next/navigation'

import getPublishedBeats, { GetPublishedBeatsResponse } from '@/library/beats/getPublishedBeats'
import logger from '@/library/misc/logger'
import { generateBeatMetadata } from '@/library/misc/metadata'

import Artwork from './components/Artwork'
import Description from './components/Description'
import Licenses from './components/Licenses'

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
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Description beat={beat} />
        </div>
        <div className="col-span-3">
          <Artwork beat={beat} />
        </div>

        <div className="col-span-9 grid grid-cols-1 gap-4">
          <Licenses beat={beat} />
        </div>
      </div>
    </div>
  )
}
