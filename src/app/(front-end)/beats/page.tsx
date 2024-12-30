import { Metadata } from 'next'

import List from '@/components/beats/List'

export const metadata: Metadata = {
  title: 'Browse beats',
  description: 'Browse beats on the Beat Store',
}

export default function AllBeatsPage() {
  return (
    <div className="m-8">
      <List />
    </div>
  )
}
