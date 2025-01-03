import { useAudioPlayer } from '@/providers/audio'
import { useUi } from '@/providers/ui'

export default function AudioPlayerDismissButton() {
  const { setShowAudioPlayer } = useUi()
  const player = useAudioPlayer()
  return (
    <button
      onClick={() => {
        setShowAudioPlayer(false)
        player.pause()
      }}
    >
      Dismiss
    </button>
  )
}
