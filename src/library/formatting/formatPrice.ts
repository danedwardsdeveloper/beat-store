import { Currency } from '@/types'

export default function formatPrice(amount: number, currency: Currency = 'USD') {
  const price = (amount / 100).toFixed(2)

  const symbols: { [key in Currency]: string } = {
    USD: '$',
    CAD: '$',
    GBP: '£',
    EUR: '€',
  }

  const formattedNumber = `${symbols[currency]}${price}`
  const currencyCode = currency === 'USD' || currency === 'CAD' ? ` ${currency}` : ''

  return `${formattedNumber}${currencyCode}`
}
