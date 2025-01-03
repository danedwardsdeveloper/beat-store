import { ReactNode } from 'react'

import { AudioProvider } from '@/providers/audio'
import { LocalStorageProvider } from '@/providers/localStorage'
import { NotificationsProvider } from '@/providers/notifications'
import { UiProvider } from '@/providers/ui'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AudioProvider>
      <NotificationsProvider>
        <UiProvider>
          <LocalStorageProvider>{children}</LocalStorageProvider>
        </UiProvider>
      </NotificationsProvider>
    </AudioProvider>
  )
}
