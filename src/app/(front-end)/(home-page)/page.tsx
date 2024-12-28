import Image from 'next/image'

import { defaultMetaDescription } from '@/library/misc/metadata'

import CtaButton from '@/components/CtaButton'

import heroPhoto from './hero.png'

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <Image src={heroPhoto} alt={defaultMetaDescription} fill className="object-cover -z-10" priority />
      <h1 className="text-6xl md:max-w-4xl text-zinc-100 mb-4 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{`Sell more beats with a custom high-performance store`}</h1>
      <CtaButton />
    </div>
  )
}
