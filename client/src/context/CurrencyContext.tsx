'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number) => string
  convertAmount: (amount: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rates relative to INR (base currency)
const exchangeRates: Record<Currency, number> = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD
  EUR: 0.011, // 1 INR = 0.011 EUR
  GBP: 0.0095 // 1 INR = 0.0095 GBP
}

const currencySymbols: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR')

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency
    if (savedCurrency && Object.keys(exchangeRates).includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Save currency preference when it changes
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency)
  }, [currency])

  const formatAmount = (amount: number): string => {
    const convertedAmount = amount * exchangeRates[currency]
    return `${currencySymbols[currency]}${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  const convertAmount = (amount: number): number => {
    return amount * exchangeRates[currency]
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
} 