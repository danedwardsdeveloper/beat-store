'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

interface UiContextType {
  mobilePanelOpen: boolean
  toggleMobilePanel: () => void
  setMobilePanelOpen: (open: boolean) => void
  currencyPanelOpen: boolean
  toggleCurrencyPanelOpen: () => void
  setCurrencyPanelOpen: (open: boolean) => void
  showAudioPlayer: boolean
  toggleAudioPlayer: () => void
  setShowAudioPlayer: (show: boolean) => void
  uiSignedIn: boolean
  setUiSignedIn: (signedIn: boolean) => void
  cartCount: number
  setCartCount: (count: number) => void
  incrementCartCount: () => void
}

const UiContext = createContext<UiContextType | undefined>(undefined)

export function UiProvider({ children }: { children: ReactNode }) {
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [currencyPanelOpen, setCurrencyPanelOpen] = useState(false)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [uiSignedIn, setUiSignedIn] = useState(false)

  const toggleMobilePanel = useCallback(() => {
    setMobilePanelOpen(prev => !prev)
  }, [])

  const toggleCurrencyPanelOpen = useCallback(() => {
    setCurrencyPanelOpen(prev => !prev)
  }, [])

  const toggleAudioPlayer = useCallback(() => {
    setShowAudioPlayer(prev => !prev)
  }, [])

  const incrementCartCount = useCallback(() => {
    setCartCount(prev => prev + 1)
  }, [])

  const value = useMemo(
    () => ({
      mobilePanelOpen,
      toggleMobilePanel,
      setMobilePanelOpen,
      currencyPanelOpen,
      toggleCurrencyPanelOpen,
      setCurrencyPanelOpen,
      showAudioPlayer,
      toggleAudioPlayer,
      setShowAudioPlayer,
      uiSignedIn,
      setUiSignedIn,
      cartCount,
      setCartCount,
      incrementCartCount,
    }),
    [
      mobilePanelOpen,
      toggleMobilePanel,
      currencyPanelOpen,
      toggleCurrencyPanelOpen,
      showAudioPlayer,
      toggleAudioPlayer,
      uiSignedIn,
      cartCount,
      incrementCartCount,
    ],
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
