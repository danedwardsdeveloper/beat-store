'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export interface NotificationInterface {
  id: number
  title: string
  message: string
}

interface NotificationsContextType {
  createNotification: (params: NotificationInterface) => void
  removeNotification: (id: number) => void
  notifications: NotificationInterface[] | null
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationInterface[] | null>(null)

  const createNotification = useCallback((params: NotificationInterface) => {
    const id = Date.now()
    setNotifications(prev => {
      if (!prev) return [{ id, title: params.title, message: params.message }]
      return [...prev, { id, title: params.title, message: params.message }]
    })
  }, [])

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
