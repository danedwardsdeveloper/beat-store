import { ReactNode } from 'react'

import { NotificationsProvider } from '@/providers/notifications'

export default function Providers({ children }: { children: ReactNode }) {
  return <NotificationsProvider>{children}</NotificationsProvider>
}
