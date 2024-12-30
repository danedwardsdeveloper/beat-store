'use client'

import Image from 'next/image'
import Link from 'next/link'

import { getPrice } from '@/library/beats/prices'
import logger from '@/library/misc/logger'

import { PlayIcon } from '../Icons'
import { useLayout } from '@/providers/layout'
import { PublicBeatWithAssets } from '@/types'

export default function BeatCard({ beat }: { beat: PublicBeatWithAssets }) {
  const { setShowAudioPlayer } = useLayout()

  const handlePlay = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowAudioPlayer(true)
    logger.info('Playing beat:', beat.title)
  }

  return (
    <Link
      href={`/beats/${beat.slug}`}
      className="flex flex-col justify-start gap-y-2 p-4 group rounded-lg hover:bg-white/10 transition-colors duration-300"
    >
      <div className="relative">
        <Image
          src={beat.assetUrls.artworkFull}
          alt={beat.metaDescription}
          height={300}
          width={300}
          className="rounded shrink-0"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
          <button
            onClick={handlePlay}
            className="p-2 rounded-full hover:bg-black/20 active:bg-black/50 transition-colors duration-300 text-zinc-400 hover:text-zinc-300"
          >
            <PlayIcon />
          </button>
        </div>
      </div>
      <h3 className="text-zinc-100 hover:text-zinc-50 font-medium text-lg truncate underline underline-offset-2 hover:decoration-zinc-50  decoration-transparent transition-all duration-300">
        {beat.title}
      </h3>
      <button className="flex w-full p-2 justify-center items-center bg-indigo-800 hover:bg-indigo-900 active:bg-indigo-950 rounded text-zinc-100 border border-indigo-600">
        {getPrice(beat, 'basic')}
      </button>
    </Link>
  )
}
