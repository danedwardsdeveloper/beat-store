'use client'

import { LocalStorageCartItem, useLocalStorage } from '@/providers/localStorage'
import { useNotifications } from '@/providers/notifications'
import { useUi } from '@/providers/ui'

export default function AddToCartButton({ id, license }: LocalStorageCartItem) {
  const { incrementCartCount, uiSignedIn } = useUi()
  const { addToCart } = useLocalStorage()
  const { createNotification } = useNotifications()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    incrementCartCount()
    if (uiSignedIn) {
      return null
    } else {
      addToCart({
        id,
        license,
      })
    }
    createNotification({
      title: '',
      message: '',
      level: 'success',
    })
  }

  return <button onClick={handleClick} className="button-primary w-full">{`Add to cart`}</button>
}
