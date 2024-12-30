import Image from 'next/image'

import { defaultMetaDescription } from '@/library/misc/metadata'

import heroPhoto from './hero.png'

export default function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 bottom-0 h-1/2 " />
      <div className="mx-auto max-w-7xl">
        <div className="relative shadow-xl sm:overflow-hidden">
          <div className="absolute inset-0">
            <Image src={heroPhoto} alt={defaultMetaDescription} className="size-full object-cover" priority />
            <div className="absolute inset-0 bg-indigo-700/20 mix-blend-multiply" />
          </div>
          <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32 text-center">
            <h1 className="block mx-auto text-4xl md:text-6xl md:max-w-4xl mb-4 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-tight">{`Sell more beats with a custom high-performance store`}</h1>
            <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <a
                  href="#"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8"
                >
                  Get started
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500/60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-500/70 sm:px-8"
                >
                  Live demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
