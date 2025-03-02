import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

const CRYPTO_SYMBOLS = [
  'BTC-USD',
  'ETH-USD',
  'USDT-USD',
  'BNB-USD',
  'XRP-USD',
  'SOL-USD',
] as const

interface HistoricalData {
  close: number
}

export async function GET() {
  try {
    const cryptoData = await Promise.all(
      CRYPTO_SYMBOLS.map(async (symbol) => {
        const quote = await yahooFinance.quote(symbol)
        const historicalData = await yahooFinance.historical(symbol, {
          period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          period2: new Date(),
          interval: '1d',
        }) as HistoricalData[]

        // Calculate volatility (standard deviation of daily returns)
        const returns = historicalData.map((day: HistoricalData, i: number) => {
          if (i === 0) return 0
          return ((day.close - historicalData[i - 1].close) / historicalData[i - 1].close) * 100
        })
        const volatility = Math.sqrt(
          returns.reduce((sum: number, ret: number) => sum + ret * ret, 0) / returns.length
        )

        return {
          symbol: symbol.replace('-USD', ''),
          price: quote.regularMarketPrice,
          change24h: quote.regularMarketChangePercent,
          volume24h: quote.regularMarketVolume,
          marketCap: quote.marketCap,
          volatility,
        }
      })
    )

    return NextResponse.json(cryptoData)
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
  }
} 