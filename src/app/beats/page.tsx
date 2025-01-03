import { Metadata } from 'next'

import BeatsList from '@/components/beats/BeatsList'

export const metadata: Metadata = {
  title: 'Browse beats',
  description: 'Browse beats on the Beat Store',
}

export default function AllBeatsPage() {
  return (
    <div className="m-2 md:m-8">
      <BeatsList />
    </div>
  )
}
