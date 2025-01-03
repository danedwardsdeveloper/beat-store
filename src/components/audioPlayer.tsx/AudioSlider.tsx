export default function AudioSlider() {
  return <div className="w-full bg-pink-200 h-1" />
}

{
  /* <Slider
label="Current time"
maxValue={player.duration}
step={1}
value={[currentTime ?? player.currentTime]}
onChange={([value]) => setCurrentTime(value)}
onChangeEnd={([value]) => {
  player.seek(value)
  if (wasPlayingRef.current) {
    player.play()
  }
}}
numberFormatter={{ format: formatHumanTime } as Intl.NumberFormat}
onChangeStart={() => {
  wasPlayingRef.current = player.playing
  player.pause()
}}
/> */
}
