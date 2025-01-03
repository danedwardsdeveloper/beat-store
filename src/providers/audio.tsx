'use client'

import { createContext, useContext, useMemo, useReducer, useRef } from 'react'

import logger from '@/library/misc/logger'

import { PublicBeatWithAssets } from '@/types'

interface PlayerState {
  playing: boolean
  duration: number
  currentTime: number
  beat: PublicBeatWithAssets | null
}

interface PublicPlayerActions {
  play: (beat?: PublicBeatWithAssets) => void
  pause: () => void
  toggle: (beat?: PublicBeatWithAssets) => void
  seekBy: (amount: number) => void
  seek: (time: number) => void
  isPlaying: (beat?: PublicBeatWithAssets) => boolean
  preload: (beat: PublicBeatWithAssets) => void
}

export type PlayerAPI = PlayerState & PublicPlayerActions

const enum ActionKind {
  SET_META = 'SET_META',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_DURATION = 'SET_DURATION',
}

type Action =
  | { type: ActionKind.SET_META; payload: PublicBeatWithAssets }
  | { type: ActionKind.PLAY }
  | { type: ActionKind.PAUSE }
  | { type: ActionKind.SET_CURRENT_TIME; payload: number }
  | { type: ActionKind.SET_DURATION; payload: number }

const AudioPlayerContext = createContext<PlayerAPI | null>(null)

function audioReducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case ActionKind.SET_META:
      return { ...state, beat: action.payload }
    case ActionKind.PLAY:
      return { ...state, playing: true }
    case ActionKind.PAUSE:
      return { ...state, playing: false }
    case ActionKind.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload }
    case ActionKind.SET_DURATION:
      return { ...state, duration: action.payload }
    default:
      return state
  }
}

const preloadBeat = (beat: PublicBeatWithAssets) => {
  logger.info('Preloading audio for beat: ', beat.title)
  const audio = new Audio()
  audio.preload = 'metadata'
  audio.src = beat.assetUrls.taggedMp3
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, {
    playing: false,
    duration: 0,
    currentTime: 0,
    beat: null,
  })
  const playerRef = useRef<React.ElementRef<'audio'>>(null)

  const actions = useMemo<PublicPlayerActions>(() => {
    return {
      play(beat) {
        if (beat) {
          dispatch({ type: ActionKind.SET_META, payload: beat })

          if (playerRef.current && playerRef.current.currentSrc !== beat.assetUrls.taggedMp3) {
            playerRef.current.src = beat.assetUrls.taggedMp3
            playerRef.current.load()
            playerRef.current.pause()
            playerRef.current.currentTime = 0
          }
        }

        playerRef.current?.play()
      },
      preload: preloadBeat,
      pause() {
        playerRef.current?.pause()
      },
      toggle(beat) {
        if (beat?.id === state.beat?.id) {
          if (state.playing) {
            this.pause()
          } else {
            this.play(beat)
          }
          return
        }
        if (beat) {
          this.play(beat)
        } else if (state.beat) {
          if (state.playing) {
            this.pause()
          } else {
            this.play(state.beat)
          }
        }
      },
      seekBy(amount) {
        if (playerRef.current) {
          playerRef.current.currentTime += amount
        }
      },
      seek(time) {
        if (playerRef.current) {
          playerRef.current.currentTime = time
        }
      },
      isPlaying(beat) {
        if (!state.playing) return false
        if (!beat) return state.playing
        return state.beat?.id === beat.id && state.playing
      },
    }
  }, [state.beat, state.playing])

  const api = useMemo<PlayerAPI>(() => ({ ...state, ...actions }), [state, actions])

  return (
    <>
      <AudioPlayerContext.Provider value={api}>{children}</AudioPlayerContext.Provider>
      <audio
        ref={playerRef}
        preload="metadata"
        onPlay={() => dispatch({ type: ActionKind.PLAY })}
        onPause={() => dispatch({ type: ActionKind.PAUSE })}
        onTimeUpdate={event => {
          dispatch({
            type: ActionKind.SET_CURRENT_TIME,
            payload: Math.floor(event.currentTarget.currentTime),
          })
        }}
        onDurationChange={event => {
          dispatch({
            type: ActionKind.SET_DURATION,
            payload: Math.floor(event.currentTarget.duration),
          })
        }}
      />
    </>
  )
}

export function useAudioPlayer(beat?: PublicBeatWithAssets) {
  const player = useContext(AudioPlayerContext)

  return useMemo<PlayerAPI>(
    () => ({
      ...player!,
      play() {
        player!.play(beat)
      },
      toggle() {
        player!.toggle(beat)
      },
      get playing() {
        return player!.isPlaying(beat)
      },
    }),
    [player, beat],
  )
}
