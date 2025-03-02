'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface CryptoData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  volatility: number
}

export default function CryptoPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('/api/crypto')
        const data = await response.json()
        setCryptoData(data)
      } catch (error) {
        console.error('Error fetching crypto data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Market</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cryptoData.map((crypto) => (
          <Card key={crypto.symbol} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{crypto.symbol}</h2>
              <span className={`text-lg ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${crypto.price.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Change</span>
                <span className={crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {crypto.change24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Volume</span>
                <span>${(crypto.volume24h / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span>${(crypto.marketCap / 1000000000).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volatility</span>
                <span className={`${crypto.volatility > 5 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {crypto.volatility.toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 