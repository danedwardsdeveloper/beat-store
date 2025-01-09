import { CA, EU, GB, US } from 'country-flag-icons/react/3x2'

export const currencyOptions = {
  CAD: {
    icon: CA,
    symbol: '$',
    label: 'Canadian Dollar',
  },
  GBP: {
    icon: GB,
    symbol: '£',
    label: 'Great British Pound',
  },
  EUR: {
    icon: EU,
    symbol: '€',
    label: 'Euro',
  },
  USD: {
    icon: US,
    symbol: '$',
    label: 'United States Dollar',
  },
} as const
