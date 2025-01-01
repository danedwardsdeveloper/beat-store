import Image from 'next/image'

import { defaultMetaDescription } from '@/library/misc/metadata'

import CtaButton from '@/components/CtaButton'

import heroPhoto from './hero.png'

export default function Hero() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl h-full">
        <div className="relative shadow-xl sm:overflow-hidden h-full">
          <div className="absolute inset-0">
            <Image
              src={heroPhoto}
              alt={defaultMetaDescription}
              className="size-full object-cover object-left md:object-center"
              priority
            />
            <div className="absolute inset-0 bg-indigo-700/20 mix-blend-multiply" />
          </div>
          <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32 text-center h-full flex flex-col justify-center">
            <h1 className="block mx-auto text-4xl md:text-6xl md:max-w-4xl mb-4 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-tight">{`Sell more beats with a custom high-performance store`}</h1>
            <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
              <div className="mx-auto inline-grid grid-cols-2 gap-5 space-y-0">
                <CtaButton variant="secondary" />
                <CtaButton variant="primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
