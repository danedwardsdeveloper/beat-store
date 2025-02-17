// import NewBeatButton from './components/NewBeatButton'
import Heading from '@/components/Heading'

export default function AdminPage() {
  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading title="Admin" intro="This page is normally hidden and password protected" />
        {/* <NewBeatButton /> */}
      </div>
    </div>
  )
}
