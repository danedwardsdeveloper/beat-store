import { useLayout } from '@/providers/layout'

export default function AudioPlayerDismissButton() {
  const { setShowAudioPlayer } = useLayout()
  return <button onClick={() => setShowAudioPlayer(false)}>Dismiss</button>
}
