'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export type NotificationLevels = 'success' | 'info' | 'warning' | 'error'

export interface NotificationInterface {
  id: number
  title: string
  message: string
  level: NotificationLevels
}

export type NewNotification = Pick<NotificationInterface, 'message' | 'title' | 'level'>

interface NotificationsContextType {
  createNotification: ({ title, message }: NewNotification) => void
  removeNotification: (id: number) => void
  notifications: NotificationInterface[] | null
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const exampleNotifications: NotificationInterface[] = [
  {
    id: 0,
    title: 'Success',
    message: `You've won a prize!`,
    level: 'success',
  },
  {
    id: 1,
    title: 'Information',
    message: `French people are French`,
    level: 'info',
  },
  {
    id: 2,
    title: 'Warning',
    message: `Your bank account has been hacked! Send me £1,000 to fix it`,
    level: 'warning',
  },
  {
    id: 3,
    title: 'Error',
    message: 'You will die in seven days',
    level: 'error',
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationInterface[] | null>(exampleNotifications)

  function createNotification({ title, message, level }: NewNotification): void {
    const id = Date.now()
    setNotifications(prev => {
      if (!prev) return [{ id, title, message, level }]
      return [...prev, { id, title, message, level }]
    })
  }

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => (prev ? prev.filter(notification => notification.id !== id) : null))
  }, [])

  return (
    <NotificationsContext.Provider value={{ notifications, createNotification, removeNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
