import clsx from 'clsx'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { defaultMetaDescription } from '@/library/misc/metadata'

import AudioPlayer from '@/components/audioPlayer.tsx'
import Footer from '@/components/Footer'
import Menus from '@/components/menus'
import NotificationContainer from '@/components/notifications/NotificationsContainer'
import Providers from '@/components/Providers'

import { audioPlayerOffsetStyles, backgroundClasses, menuBarOffsetStyles, textColourClasses } from '@/styles'
import '@/styles/globals.tailwind.css'

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
      <body
        className={clsx(
          'flex flex-col min-h-screen',
          'antialiased font-sans',
          backgroundClasses.primary,
          textColourClasses.paragraph,
        )}
      >
        <Providers>
          <Menus />
          <main className={clsx('flex-1', audioPlayerOffsetStyles, menuBarOffsetStyles)}>{children}</main>
          <Footer />
          <AudioPlayer />
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  )
}
