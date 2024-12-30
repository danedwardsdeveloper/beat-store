'use client'

import clsx from 'clsx'

import AudioPlayerDismissButton from './AudioPlayerDismissButton'
import AudioSlider from './AudioSlider'
import { useLayout } from '@/providers/layout'

export default function AudioPlayer() {
  const { showAudioPlayer } = useLayout()
  return (
    <div
      className={clsx(
        'fixed left-0 right-0 bottom-0 w-full',
        'transition-all duration-500',
        'bg-pink-500',
        showAudioPlayer ? 'h-16' : 'h-0',
      )}
    >
      <AudioSlider />
      <div className="h-full flex justify-between items-center mr-4">
        <div className="h-full aspect-square bg-red-500" />
        <h2>Audio Player</h2>
        <AudioPlayerDismissButton />
      </div>
    </div>
  )
}
