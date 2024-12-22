import Sharp from 'sharp'

export async function generateSocialImage(imageBuffer: Buffer): Promise<Buffer> {
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
