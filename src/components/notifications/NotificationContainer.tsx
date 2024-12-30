'use client'

import NotificationItem from './NotificationItem'
import { useNotifications } from '@/providers/notifications'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications &&
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
      </div>
    </div>
  )
}
