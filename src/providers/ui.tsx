'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

interface UiContextType {
  mobilePanelOpen: boolean
  toggleMobilePanel: () => void
  setMobilePanelOpen: (open: boolean) => void
  showAudioPlayer: boolean
  toggleAudioPlayer: () => void
  setShowAudioPlayer: (show: boolean) => void
  uiSignedIn: boolean
  setUiSignedIn: (signedIn: boolean) => void
}

const UiContext = createContext<UiContextType | undefined>(undefined)

export function UiProvider({ children }: { children: ReactNode }) {
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [uiSignedIn, setUiSignedIn] = useState(false)

  const toggleMobilePanel = useCallback(() => {
    setMobilePanelOpen(prev => !prev)
  }, [])

  const toggleAudioPlayer = useCallback(() => {
    setShowAudioPlayer(prev => !prev)
  }, [])

  const value = useMemo(
    () => ({
      mobilePanelOpen,
      toggleMobilePanel,
      setMobilePanelOpen,
      showAudioPlayer,
      toggleAudioPlayer,
      setShowAudioPlayer,
      uiSignedIn,
      setUiSignedIn,
    }),
    [mobilePanelOpen, toggleMobilePanel, showAudioPlayer, toggleAudioPlayer, uiSignedIn],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const context = useContext(UiContext)
  if (context === undefined) {
    throw new Error('useUi must be used within a UiProvider')
  }
  return context
}
