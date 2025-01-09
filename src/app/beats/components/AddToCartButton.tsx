'use client'

import { useUi } from '@/providers/ui'

export default function AddToCartButton() {
  const { incrementCartCount } = useUi()

  return <button onClick={incrementCartCount} className="button-primary w-full">{`Add to cart`}</button>
}
