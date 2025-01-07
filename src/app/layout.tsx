import clsx from 'clsx'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { dynamicBaseURL } from '@/library/environment/publicVariables'
import { marketingCopy } from '@/library/misc/marketingCopy'

import AudioPlayer from '@/components/audioPlayer.tsx'
import Footer from '@/components/Footer'
import DesktopMenu from '@/components/menus/desktop'
import MobileMenu from '@/components/menus/mobile'
import NotificationContainer from '@/components/notifications/NotificationsContainer'
import Providers from '@/components/Providers'

import '@/styles/globals.tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const socialImageURL = `${dynamicBaseURL}/beat-store.png`

export const metadata: Metadata = {
  title: marketingCopy.metaTitle,
  description: marketingCopy.metaDescription,
  alternates: {
    canonical: dynamicBaseURL,
  },
  openGraph: {
    title: marketingCopy.metaTitle,
    description: marketingCopy.metaDescription,
    url: dynamicBaseURL,
    siteName: 'Beat Store',
    images: [
      {
        url: socialImageURL,
        width: 1200,
        height: 630,
        alt: marketingCopy.metaTitle,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: marketingCopy.metaTitle,
    description: marketingCopy.metaDescription,
    images: [socialImageURL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
          'flex flex-col min-h-screen', //
          'bg-primary text-primary',
          'antialiased font-sans',
        )}
      >
        <Providers>
          <DesktopMenu />
          <MobileMenu />
          <main
            className={clsx(
              'flex-1', //
              'mt-menu-bar mb-audio-player',
            )}
          >
            {children}
          </main>
          <Footer />
          <AudioPlayer />
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  )
}
