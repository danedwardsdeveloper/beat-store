import { LicenseType } from '@prisma/client'

import { PublicBeatWithAssets } from '@/types'

export const defaultPrices = {
  basic: 2999,
  premium: 4999,
  unlimited: 9999,
  exclusive: 2999,
}

function formatPrice(price: number): string {
  const dollars = price / 100
  const isWholeNumber = dollars % 1 === 0

  return isWholeNumber
    ? `$${dollars.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    : `$${dollars.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function getPrice(beat: PublicBeatWithAssets, license: LicenseType) {
  const customPrices = {
    basic: beat.customPriceBasic ?? defaultPrices.basic,
    premium: beat.customPricePremium ?? defaultPrices.premium,
    unlimited: beat.customPriceUnlimited ?? defaultPrices.unlimited,
    exclusive: beat.customPriceExclusive ?? defaultPrices.exclusive,
  }
  const resolvedPrice = beat.useDefaultPrices ? defaultPrices[license] : customPrices[license]
  return formatPrice(resolvedPrice)
}
