import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { defaultMetaDescription } from '@/library/metadata'

import Menus from '@/components/menus'

import './global-styles.tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Beat Store | Home',
  description: defaultMetaDescription,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="antialiased font-sans bg-black text-zinc-300">
        <Menus />
        {children}
      </body>
    </html>
  )
}
