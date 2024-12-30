import getPublishedBeats, { GetPublishedBeatsResponse } from '@/library/beats/getPublishedBeats'

import BeatCard from './BeatCard'

export default async function BeatsList() {
  const response = await getPublishedBeats()
  const { beats, message }: GetPublishedBeatsResponse = response

  if (!beats) {
    return <p>{`Message: ${message}`}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {Array.from({ length: 10 }, (v, i) => beats[i % 2]).map((beat, index) => (
        <BeatCard key={index} beat={beat} />
      ))}
    </div>
  )
}
