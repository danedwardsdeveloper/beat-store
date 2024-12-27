import type { Metadata } from 'next'

import Menu from '@/components/menu'

export const metadata: Metadata = {
  title: 'Beat Store',
  description: 'A modern e-commerce app for selling beats',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB">
      <body className="font-sans antialiased">
        <Menu />
        {children}
      </body>
    </html>
  )
}
