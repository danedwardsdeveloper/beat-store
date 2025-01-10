'use client'

import { LicenseType } from '@prisma/client'
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from 'react'

import logger from '@/library/misc/logger'

import { Currency } from '@/types'

export interface LocalStorageCartItem {
  id: string
  license: LicenseType
}

interface State {
  isExistingUser: boolean
  prefersStaySignedIn: boolean
  selectedCurrency: Currency
  cart: LocalStorageCartItem[]
}

type Action =
  | { type: 'SET_IS_EXISTING_USER'; payload: boolean }
  | { type: 'SET_PREFERS_STAY_SIGNED_IN'; payload: boolean }
  | { type: 'SET_SELECTED_CURRENCY'; payload: Currency }
  | { type: 'LOAD_STORED_VALUES'; payload: Partial<State> }
  | { type: 'ADD_TO_CART'; payload: LocalStorageCartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string } // id
  | { type: 'UPDATE_LICENSE'; payload: { id: string; license: LicenseType } }
  | { type: 'CLEAR_CART' }

const initialState: State = {
  isExistingUser: false,
  prefersStaySignedIn: false,
  selectedCurrency: 'USD',
  cart: [],
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_IS_EXISTING_USER':
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

    case 'ADD_TO_CART': {
      const newCart = [...(state.cart || []), action.payload]
      localStorage.setItem('cart', JSON.stringify(newCart))
      return { ...state, cart: newCart }
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart?.filter(item => item.id !== action.payload) || []
      localStorage.setItem('cart', JSON.stringify(newCart))
      return { ...state, cart: newCart }
    }

    case 'UPDATE_LICENSE': {
      const newCart =
        state.cart?.map(item =>
          item.id === action.payload.id ? { ...item, license: action.payload.license } : item,
        ) || []
      localStorage.setItem('cart', JSON.stringify(newCart))
      return { ...state, cart: newCart }
    }

    case 'CLEAR_CART': {
      localStorage.removeItem('cart')
      return { ...state, cart: [] }
    }

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
  cart: LocalStorageCartItem[]
  addToCart: (item: LocalStorageCartItem) => void
  removeFromCart: (id: string) => void
  updateLicense: (id: string, license: LicenseType) => void
  clearCart: () => void
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null)

export function LocalStorageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const storedValues: Partial<State> = {}

      const keys: (keyof State)[] = ['isExistingUser', 'prefersStaySignedIn', 'selectedCurrency', 'cart']
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
      setIsExistingUser: value => dispatch({ type: 'SET_IS_EXISTING_USER', payload: value }),
      prefersStaySignedIn: state.prefersStaySignedIn,
      setPrefersStaySignedIn: value => dispatch({ type: 'SET_PREFERS_STAY_SIGNED_IN', payload: value }),
      selectedCurrency: state.selectedCurrency,
      setSelectedCurrency: value => dispatch({ type: 'SET_SELECTED_CURRENCY', payload: value }),
      loaded,
      cart: state.cart || [],
      addToCart: item => dispatch({ type: 'ADD_TO_CART', payload: item }),
      removeFromCart: id => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
      updateLicense: (id, license) =>
        dispatch({
          type: 'UPDATE_LICENSE',
          payload: { id, license },
        }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    [state.isExistingUser, state.prefersStaySignedIn, state.selectedCurrency, state.cart, loaded],
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
