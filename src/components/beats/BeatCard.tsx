'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { getPrice } from '@/library/beats/prices'

import PlayPauseIcon from '@/components/icons/PlayPauseIcon'

import { useAudioPlayer } from '@/providers/audio'
import { useUi } from '@/providers/ui'
import { PublicBeatWithAssets } from '@/types'

export default function BeatCard({
  beat,
  eagerLoading,
}: {
  beat: PublicBeatWithAssets
  eagerLoading: boolean
}) {
  const player = useAudioPlayer(beat)
  const { setShowAudioPlayer } = useUi()

  const cardRef = useRef<HTMLAnchorElement>(null)

  function handleClick(event: React.MouseEvent) {
    event.preventDefault()
    setShowAudioPlayer(true)
    player.toggle(beat)
  }

  useEffect(() => {
    if (!cardRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            player.preload(beat)
          }
        })
      },
      { rootMargin: '50px' },
    )

    observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [beat, player])

  return (
    <Link
      ref={cardRef}
      href={`/beats/${beat.slug}`}
      className="flex flex-col justify-start gap-y-2 p-4 group rounded-lg hover:bg-white/10 transition-colors duration-300"
    >
      <div className="relative">
        <Image
          src={beat.assetUrls.artworkFull}
          alt={beat.metaDescription}
          // ToDo: set sizes
          height={640}
          width={640}
          className="rounded shrink-0"
          priority={eagerLoading}
        />
        <div className="absolute inset-0 flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
          <button
            onClick={handleClick}
            className={clsx(
              'p-2 rounded-full transition-colors duration-300',
              'active:bg-black/50 hover:bg-black/20  md:text-zinc-400 md:hover:text-zinc-300', // Hidden unless hover on desktop
              'text-zinc-300 bg-black/50', // Play button always visible on mobile
            )}
          >
            <PlayPauseIcon size="size-14" />
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
