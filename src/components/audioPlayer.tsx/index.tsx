'use client'

import clsx from 'clsx'
import Image from 'next/image'

import AudioPlayerDismissButton from './AudioPlayerDismissButton'
import AudioSlider from './AudioSlider'
import { useAudioPlayer } from '@/providers/audio'
import { useUi } from '@/providers/ui'

export default function AudioPlayer() {
  const { showAudioPlayer } = useUi()
  const { beat } = useAudioPlayer()

  if (!beat) {
    return null
  }
  return (
    <div
      data-component="AudioPlayer"
      className={clsx(
        'fixed left-0 right-0 bottom-0 w-full',
        'transition-all duration-500',
        'bg-pink-500',
        showAudioPlayer ? 'h-16' : 'h-0',
      )}
    >
      <AudioSlider />
      <div className="h-full flex justify-between items-center mr-4">
        <Image
          src={beat.assetUrls.artworkThumb}
          height={64}
          width={64}
          alt={beat.title}
          className="h-full w-auto"
        />
        <h2>Audio Player</h2>
        <AudioPlayerDismissButton />
      </div>
    </div>
  )
}
