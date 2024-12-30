'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface LayoutContextType {
  mobilePanelOpen: boolean
  toggleMobilePanel: () => void
  setMobilePanelOpen: (open: boolean) => void
  showAudioPlayer: boolean
  toggleAudioPlayer: () => void
  setShowAudioPlayer: (show: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)

  const toggleMobilePanel = useCallback(() => {
    setMobilePanelOpen(prev => !prev)
  }, [])

  const toggleAudioPlayer = useCallback(() => {
    setShowAudioPlayer(prev => !prev)
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        mobilePanelOpen,
        toggleMobilePanel,
        setMobilePanelOpen,
        showAudioPlayer,
        toggleAudioPlayer,
        setShowAudioPlayer,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
