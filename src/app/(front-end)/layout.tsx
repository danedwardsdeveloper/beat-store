import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { defaultMetaDescription } from '@/library/misc/metadata'

import Providers from './(home-page)/components/Providers'
import Menus from '@/components/menus'
import NotificationContainer from '@/components/notifications/NotificationContainer'

import './styles/globals.tailwind.css'

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
      <body className="antialiased font-sans bg-slate-900 text-zinc-300 min-h-screen">
        <Providers>
          <Menus />
          <main>{children}</main>
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  )
}
