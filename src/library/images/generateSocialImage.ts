import Sharp from 'sharp'

export default async function generateSocialImage(base64Image: string): Promise<Buffer> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
  const imageBuffer = Buffer.from(base64Data, 'base64')

  const blurredBackground = await Sharp(imageBuffer)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center',
    })
    .blur(20)
    .modulate({
      brightness: 0.5,
    })
    .toBuffer()

  const mainThumbnail = await Sharp(imageBuffer)
    .resize(630, 630, {
      fit: 'contain',
      position: 'center',
    })
    .toBuffer()

  return await Sharp(blurredBackground)
    .composite([
      {
        input: mainThumbnail,
        left: (1200 - 630) / 2,
        top: 0,
      },
    ])
    .png()
    .toBuffer()
}
