import Image from 'next/image'
import Link from 'next/link'

import { dynamicBaseURL } from '@/library/environment/privateVariables'

import { ApiEndpoints } from '@/app/api/types'

export default async function BeatsList() {
  const response = await fetch(`${dynamicBaseURL}/api/published-beats`, {
    method: 'GET',
  })
  const { message, beats }: ApiEndpoints['/api/published-beats']['response'] = await response.json()

  if (!beats) {
    return <p>{`Message: ${message}`}</p>
  }

  return (
    <div>
      {beats.map(beat => (
        <div key={beat.slug}>
          <h2>{`Title`}</h2>
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
          <Link href={`/beats/${beat.slug}`}>More details</Link>
        </div>
      ))}
    </div>
  )
}
