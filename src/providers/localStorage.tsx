'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from 'react'

import logger from '@/library/misc/logger'

import { Currency } from '@/types'

interface State {
  isExistingUser: boolean
  prefersStaySignedIn: boolean
  selectedCurrency: Currency
}

type Action =
  | { type: 'SET_EXISTING_USER'; payload: boolean }
  | { type: 'SET_PREFERS_STAY_SIGNED_IN'; payload: boolean }
  | { type: 'SET_SELECTED_CURRENCY'; payload: Currency }
  | { type: 'LOAD_STORED_VALUES'; payload: Partial<State> }

const initialState: State = {
  isExistingUser: false,
  prefersStaySignedIn: false,
  selectedCurrency: 'USD',
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EXISTING_USER':
      localStorage.setItem('isExistingUser', JSON.stringify(action.payload))
      return { ...state, isExistingUser: action.payload }

    case 'SET_PREFERS_STAY_SIGNED_IN':
      localStorage.setItem('prefersStaySignedIn', JSON.stringify(action.payload))
      return { ...state, prefersStaySignedIn: action.payload }

    case 'SET_SELECTED_CURRENCY':
      localStorage.setItem('selectedCurrency', JSON.stringify(action.payload))
      return { ...state, selectedCurrency: action.payload }

    case 'LOAD_STORED_VALUES':
      return { ...state, ...action.payload }

    default:
      return state
  }
}

interface LocalStorageContextType {
  isExistingUser: boolean
  setIsExistingUser: (value: boolean) => void
  prefersStaySignedIn: boolean
  setPrefersStaySignedIn: (value: boolean) => void
  selectedCurrency: Currency
  setSelectedCurrency: (value: Currency) => void
  loaded: boolean
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null)

export function LocalStorageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const storedValues: Partial<State> = {}

      const keys: (keyof State)[] = ['isExistingUser', 'prefersStaySignedIn', 'selectedCurrency']
      keys.forEach(key => {
        const stored = localStorage.getItem(key)
        if (stored) {
          storedValues[key] = JSON.parse(stored)
        }
      })

      dispatch({ type: 'LOAD_STORED_VALUES', payload: storedValues })
    } catch (error) {
      logger.error('Failed to load stored values:', error)
    }
    setLoaded(true)
  }, [])

  const value = useMemo<LocalStorageContextType>(
    () => ({
      isExistingUser: state.isExistingUser,
      setIsExistingUser: value => dispatch({ type: 'SET_EXISTING_USER', payload: value }),
      prefersStaySignedIn: state.prefersStaySignedIn,
      setPrefersStaySignedIn: value => dispatch({ type: 'SET_PREFERS_STAY_SIGNED_IN', payload: value }),
      selectedCurrency: state.selectedCurrency,
      setSelectedCurrency: value => dispatch({ type: 'SET_SELECTED_CURRENCY', payload: value }),
      loaded,
    }),
    [state.isExistingUser, state.prefersStaySignedIn, state.selectedCurrency, loaded],
  )

  return <LocalStorageContext.Provider value={value}>{children}</LocalStorageContext.Provider>
}

export function useLocalStorage() {
  const context = useContext(LocalStorageContext)
  if (!context) {
    logger.error('useLocalStorage must be used within a LocalStorageProvider')
    throw new Error('useLocalStorage must be used within a LocalStorageProvider')
  }
  return context
}
