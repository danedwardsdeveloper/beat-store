import { ReactNode } from 'react'

import { LayoutProvider } from '@/providers/layout'
import { NotificationsProvider } from '@/providers/notifications'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <NotificationsProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </NotificationsProvider>
  )
}
