import Image from 'next/image'
import { notFound } from 'next/navigation'

import { dynamicBaseURL } from '@/library/environment/privateVariables'
import { generateBeatMetadata } from '@/library/metadata'

import { BeatsSlugGET } from '@/app/api/published-beats/[slug]/route'
import { PublicBeatWithAssets } from '@/app/api/types'

export async function generateStaticParams() {
  const response = await fetch(`${dynamicBaseURL}/api/published-beats`, {
    method: 'GET',
  })
  const { beats } = await response.json()
  return beats.map((beat: PublicBeatWithAssets) => ({
    slug: beat.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const response = await fetch(`${dynamicBaseURL}/api/published-beats/${slug}`, {
    method: 'GET',
  })
  const { beat }: BeatsSlugGET = await response.json()
  if (!beat) return {}
  return generateBeatMetadata({ beat })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const response = await fetch(`${dynamicBaseURL}/api/published-beats/${slug}`, {
    method: 'GET',
  })
  const { beat }: BeatsSlugGET = await response.json()

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
