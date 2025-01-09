import { ReactNode } from 'react'

import { AudioProvider } from '@/providers/audio'
import { LocalStorageProvider } from '@/providers/localStorage'
import { NotificationsProvider } from '@/providers/notifications'
import { UiProvider } from '@/providers/ui'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocalStorageProvider>
      <AudioProvider>
        <NotificationsProvider>
          <UiProvider>{children}</UiProvider>
        </NotificationsProvider>
      </AudioProvider>
    </LocalStorageProvider>
  )
}
