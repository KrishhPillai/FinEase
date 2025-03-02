'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PortfolioAsset } from '@/lib/types'
import { useAssets } from '@/context/AssetsContext';
import { Upload, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useCurrency } from '@/context/CurrencyContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MarketMood {
  Negative: number
  Neutral: number
  Positive: number
}

const getMarketMood = async (): Promise<string> => {
  try {
    const response = await fetch('http://65.1.209.37:5000/mmi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: '^BSESN',
        start_date: '2025-01-01',
        end_date: '2025-01-17'
      })
    })

    const data: MarketMood = await response.json()
    
    // Determine the dominant mood
    const moods = [
      { type: 'Negative', value: data.Negative },
      { type: 'Neutral', value: data.Neutral },
      { type: 'Positive', value: data.Positive }
    ]
    
    const dominantMood = moods.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    )

    return dominantMood.type.toLowerCase()
  } catch (error) {
    console.error('Error fetching market mood:', error)
    return 'neutral' // Default to neutral if there's an error
  }
}

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024,
}

// Initialize the model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

// Create a chat session with the portfolio advisor context
const createChatSession = () => {
  return model.startChat({
    generationConfig,
    history: [],
  })
}

export default function PortfolioPage() {
  const { assets, setAssets } = useAssets();
  // const [assets, setAssets] = useState<PortfolioAsset[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [marketMood, setMarketMood] = useState<string>('neutral')
  const [chatSession] = useState(() => createChatSession())
  const { formatAmount } = useCurrency()

  useEffect(() => {
    const fetchMarketMood = async () => {
      const mood = await getMarketMood()
      setMarketMood(mood)
    }
    fetchMarketMood()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // First message should set the context with market mood
      if (messages.length === 0) {
        const prompt = `You are a financial portfolio building chatbot, that suggests users where to invest their money.
The user is a novice investor willing to invest in investments, and budget amount will be given. Based on this, suggest how can the user divide their money (IN PERCENTAGE AND VALUE).
The current Stock market mood is ${marketMood}, if the mood is positive, add more funds in stocks.
If neutral, ask user to wait for a bit and then invest. If negative, reduce stock investment. IF USER HAS NOT DEFINED THE BUDGET, THEN ASK FOR THE BUDGET AND DONT GIVE DISTRUBUTIONS OR SUGGESTIONS.

The investment types you can choose from are:
1. Stocks (longterm for medium risk, intraday for high risk)
2. Mutual Funds (low risk, high budget)
3. Fixed Deposits (low risk, low/medium budget)
4. Recurring Deposits (low risk, medium/high budget )
5. IPOs (High risk, high budget)
6. Gold, Silver, and other commodities (low risk, high budget)
7. Real Estate (low risk, high budget)
8. Cryptocurrencies (high risk, high budget)
9. Bonds (low risk, medium budget)
10. ETFs (low risk, medium budget)
11. Index Funds (low risk, medium budget)
12. Forex (high risk, high budget)

Rules:
1. Response should be TO THE POINT.
2. Response MUST BE IN POINTERS.
3. Talk like a financial advisor.
4. ONLY WHERE TO INVEST SHOULD BE IN RESPONSE AND EXPLAIN WHY TO INVEST IN THAT.
`
        
        await chatSession.sendMessage([{ text: prompt }])
      }

      const result = await chatSession.sendMessage([{ text: userMessage }])
      const response = await result.response
      const text = response.text()

      // Add assistant message to chat
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleStockFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      
      const parsedAssets: PortfolioAsset[] = lines
        .slice(1) // Skip header row
        .filter(line => line.trim()) // Skip empty lines
        .map((line, index) => {
          const values = line.split(',')
          const type = values[0].toLowerCase()

          if (type === 'stock') {
            return {
              id: `stock-${index}`,
              type: 'stock',
              ticker: values[1],
              quantity: parseFloat(values[2]),
              purchasePrice: parseFloat(values[3]),
              currentPrice: parseFloat(values[4]),
              purchaseDate: new Date(values[5])
            }
          } else {
            return {
              id: `commodity-${index}`,
              type: 'commodity',
              name: values[1].toLowerCase() as 'gold' | 'silver' | 'copper',
              quantity: parseFloat(values[2]),
              purchasePrice: parseFloat(values[3]),
              currentPrice: parseFloat(values[4]),
              purchaseDate: new Date(values[5])
            }
          }
        })

      setAssets(parsedAssets)
    }
    reader.readAsText(file)
  }

  const calculateTotalInvestment = () => {
    return assets.reduce((total, asset) => {
      return total + (asset.purchasePrice * asset.quantity)
    }, 0)
  }

  const calculateCurrentValue = () => {
    return assets.reduce((total, asset) => {
      return total + (asset.currentPrice * asset.quantity)
    }, 0)
  }

  const calculateTotalReturn = () => {
    const investment = calculateTotalInvestment()
    const currentValue = calculateCurrentValue()
    return ((currentValue - investment) / investment) * 100
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Investment Portfolio</h1>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleStockFileUpload}
              className="hidden"
              id="portfolio-upload"
            />
            <Button
              onClick={() => document.getElementById('portfolio-upload')?.click()}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Portfolio CSV
            </Button>
          </div>
        </div>

        {/* Portfolio Advisor Chat */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Advisor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[300px] overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground">
                  <p>👋 Hi! I&apos;m your portfolio advisor.</p>
                  <p>Ask me about portfolio allocation and investment strategies!</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-lg max-w-[80%] ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-lg bg-muted">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about portfolio allocation..."
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                Send
              </Button>
            </form>

            <div className="text-sm text-muted-foreground text-center pt-2 border-t">
              According to our realtime recommendation model, the current market mood is{' '}
              <span className={`font-medium ${
                marketMood === 'positive' ? 'text-green-600' :
                marketMood === 'negative' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {marketMood}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portfolio Summary Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(calculateTotalInvestment())}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(calculateCurrentValue())}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${calculateTotalReturn() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateTotalReturn().toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Tables */}
        <div className="mt-8 grid gap-8">
          {/* Stocks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets
                    .filter(asset => asset.type === 'stock')
                    .map(asset => {
                      const stockAsset = asset as Extract<PortfolioAsset, { type: 'stock' }>
                      const totalValue = stockAsset.currentPrice * stockAsset.quantity
                      const returnPercentage = ((stockAsset.currentPrice - stockAsset.purchasePrice) / stockAsset.purchasePrice) * 100

                      return (
                        <TableRow key={asset.id}>
                          <TableCell>{stockAsset.ticker}</TableCell>
                          <TableCell>{stockAsset.quantity}</TableCell>
                          <TableCell>{formatAmount(stockAsset.purchasePrice)}</TableCell>
                          <TableCell>{formatAmount(stockAsset.currentPrice)}</TableCell>
                          <TableCell>{formatAmount(totalValue)}</TableCell>
                          <TableCell className={returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {returnPercentage.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Commodities Table */}
          <Card>
            <CardHeader>
              <CardTitle>Commodities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity (g)</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets
                    .filter(asset => asset.type === 'commodity')
                    .map(asset => {
                      const commodityAsset = asset as Extract<PortfolioAsset, { type: 'commodity' }>
                      const totalValue = commodityAsset.currentPrice * commodityAsset.quantity
                      const returnPercentage = ((commodityAsset.currentPrice - commodityAsset.purchasePrice) / commodityAsset.purchasePrice) * 100

                      return (
                        <TableRow key={asset.id}>
                          <TableCell className="capitalize">{commodityAsset.name}</TableCell>
                          <TableCell>{commodityAsset.quantity}</TableCell>
                          <TableCell>{formatAmount(commodityAsset.purchasePrice)}</TableCell>
                          <TableCell>{formatAmount(commodityAsset.currentPrice)}</TableCell>
                          <TableCell>{formatAmount(totalValue)}</TableCell>
                          <TableCell className={returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {returnPercentage.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 