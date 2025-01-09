'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { currencyOptions } from '@/library/misc/currencyOptions'

import { useLocalStorage } from '@/providers/localStorage'
import { useUi } from '@/providers/ui'
import { Currency } from '@/types'

export default function CurrencyOptions() {
  const { selectedCurrency, setSelectedCurrency } = useLocalStorage()
  const { currencyPanelOpen, setCurrencyPanelOpen, toggleCurrencyPanelOpen } = useUi()
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const menuRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<(HTMLDivElement | null)[]>([])

  const SelectedIcon = currencyOptions[selectedCurrency].icon

  function handleSelect(code: Currency) {
    setSelectedCurrency(code)
    setCurrencyPanelOpen(false)
    setFocusedIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        setCurrencyPanelOpen(false)
        setFocusedIndex(-1)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!currencyPanelOpen) {
          setCurrencyPanelOpen(true)
        }
        setFocusedIndex(prev => (prev + 1) % Object.keys(currencyOptions).length)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!currencyPanelOpen) {
          setCurrencyPanelOpen(true)
        }
        setFocusedIndex(prev => (prev <= 0 ? Object.keys(currencyOptions).length - 1 : prev - 1))
        break
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0) {
          const code = Object.keys(currencyOptions)[focusedIndex] as Currency
          handleSelect(code)
        }
        break
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (currencyPanelOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setCurrencyPanelOpen(false)
        setFocusedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [currencyPanelOpen, setCurrencyPanelOpen])

  useEffect(() => {
    if (currencyPanelOpen && focusedIndex >= 0) {
      optionsRef.current[focusedIndex]?.focus()
    }
  }, [focusedIndex, currencyPanelOpen])

  return (
    <div
      data-component="CurrencyButton"
      ref={menuRef}
      className="relative h-full flex items-center"
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={toggleCurrencyPanelOpen}
        aria-expanded={currencyPanelOpen}
        aria-haspopup="listbox"
        aria-controls="currency-listbox"
        aria-label={`Selected currency: ${selectedCurrency}`}
        className="flex items-center justify-center gap-x-1 text-sm/6 font-semibold h-full focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
      >
        <div className="w-12 h-8 rounded-sm overflow-hidden">
          <SelectedIcon />
        </div>
        <span className="sr-only">{currencyOptions[selectedCurrency].label}</span>
      </button>

      <div
        data-component="CurrencyMenu"
        id="currency-listbox"
        role="listbox"
        aria-label="Select currency"
        aria-activedescendant={
          focusedIndex >= 0 ? `currency-option-${Object.keys(currencyOptions)[focusedIndex]}` : undefined
        }
        tabIndex={-1}
        className={clsx(
          currencyPanelOpen ? 'absolute' : 'hidden',
          'transition-opacity duration-300',
          'top-12 left-20 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4 transition shadow-lg',
          'z-currency-panel',
        )}
      >
        <div className="w-56 shrink rounded-xl bg-slate-800 p-4 text-sm/6 font-semibold shadow-lg ring-1 ring-gray-900/5 flex flex-col gap-y-2">
          {Object.entries(currencyOptions).map(([code, { icon: FlagIcon, label }], index) => (
            <div
              key={code}
              id={`currency-option-${code}`}
              ref={(element: HTMLDivElement | null) => {
                if (optionsRef.current) {
                  optionsRef.current[index] = element
                }
              }}
              role="option"
              aria-selected={code === selectedCurrency}
              aria-label={label}
              onClick={() => handleSelect(code as keyof typeof currencyOptions)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleSelect(code as keyof typeof currencyOptions)
                }
              }}
              tabIndex={focusedIndex === index ? 0 : -1}
              className={clsx(
                'flex items-center gap-x-2 p-2 transition-colors duration-300 hover:bg-white/10 rounded group',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                code === selectedCurrency && 'bg-white/10',
              )}
            >
              <div className="w-12 h-8 rounded-sm overflow-hidden mx-2">
                <FlagIcon />
              </div>
              <span
                className={clsx(
                  'transition-colors duration-300',
                  code === selectedCurrency
                    ? 'text-indigo-400 cursor-default'
                    : 'group-hover:text-indigo-400 cursor-pointer',
                )}
              >
                {code}
              </span>
              <span className="sr-only">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
