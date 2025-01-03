'use client'

import { IconSizes, SvgContainer } from './SvgContainer'
import { useAudioPlayer } from '@/providers/audio'

export function PlayIcon({ size }: { size?: IconSizes }) {
  return (
    <SvgContainer size={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
      />
    </SvgContainer>
  )
}

export function PauseIcon({ size }: { size?: IconSizes }) {
  return (
    <SvgContainer size={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </SvgContainer>
  )
}

export default function PlayPauseIcon({ size }: { size?: IconSizes }) {
  const player = useAudioPlayer()
  return player.playing ? <PauseIcon size={size} /> : <PlayIcon size={size} />
}
