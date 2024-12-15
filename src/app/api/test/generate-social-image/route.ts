import { writeFile } from 'fs/promises'

import { NextResponse } from 'next/server'
import { homedir } from 'os'
import { join } from 'path'

import generateSocialImage from '@/library/images/generateSocialImage'
import logger from '@/library/logger'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    const socialImageBuffer = await generateSocialImage(image)

    const filename = `social-${Date.now()}.png`

    const desktopPath = join(homedir(), 'Desktop')
    const filePath = join(desktopPath, filename)

    await writeFile(filePath, socialImageBuffer)

    return NextResponse.json({
      success: true,
      path: filePath,
      filename,
    })
  } catch (error) {
    logger.error('Error generating social image:', error)
    return NextResponse.json({ error: 'Failed to generate social image' }, { status: 500 })
  }
}
