import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-inter)', ...fontFamily.sans] },
    },
  },
} satisfies Config
