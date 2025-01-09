import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import { fontFamily, spacing, zIndex } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'selector',
  safelist: ['button-primary', 'button-secondary'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-inter)', ...fontFamily.sans] },
      textColor: {
        primary: colors.zinc[300],
        heading: colors.zinc[100],
        'button-primary': colors.white,
        'button-secondary': colors.indigo[700],
      },
      backgroundColor: {
        primary: colors.slate[950],
        secondary: colors.slate[900],
        //
        'button-primary': colors.indigo[700],
        'button-primary-hover': colors.indigo[600],
        'button-primary-active': colors.indigo[500],
        //
        'button-secondary': colors.white,
        'button-secondary-hover': colors.indigo[50],
        'button-secondary-active': colors.indigo[100],
      },
      margin: {
        'menu-bar': spacing['16'],
        'audio-player': spacing['20'],
      },
      zIndex: {
        'card-interaction': zIndex[10],
        'audio-player': zIndex[10],
        'menu-bar': zIndex[20],
        'currency-panel': zIndex[20],
        notifications: zIndex[50],
      },
      borderColor: {
        primary: colors.slate[800],
      },
      outlineColor: {
        'button-primary': colors.indigo[700],
        'button-secondary': colors.white,
      },
    },
  },
} satisfies Config
