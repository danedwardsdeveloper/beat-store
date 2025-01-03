import { PublicBeatWithAssets } from '@/types'

export default function Description({ beat }: { beat: PublicBeatWithAssets }) {
  return (
    <>
      <h2 className="text-base/7 font-semibold text-indigo-400">Beat Store</h2>
      <p className="mt-2 max-w-lg text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {beat.title}
      </p>
      <h1></h1>
      {beat.description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  )
}
