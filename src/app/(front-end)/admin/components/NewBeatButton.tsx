'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import logger from '@/library/misc/logger'

import { AdminBeatsResponsePOST } from '@/app/api/admin/beats/route'

export default function NewBeatButton() {
  const router = useRouter()
  const [buttonText, setButtonText] = useState('Upload new beat')

  async function handleClick() {
    const response = await fetch('/api/admin/beats', {
      method: 'POST',
    })
    const { message, beatId }: AdminBeatsResponsePOST = await response.json()
    logger.info('Beat ID: ', beatId)
    switch (message) {
      case 'success':
        return router.push(`/admin/beats/${beatId}`)
      default:
        return setButtonText(message)
    }
  }
  return <button onClick={() => handleClick()}>{buttonText}</button>
}
