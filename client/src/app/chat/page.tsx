'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
}

// Initialize the model outside the component
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

// Create a chat session with the finance-focused context
const createChatSession = () => {
  return model.startChat({
    generationConfig,
    history: [],
  })
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatSession] = useState(() => createChatSession())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // First message should set the context
      if (messages.length === 0) {
        await chatSession.sendMessage([{ text: "You are a bot that helps me understand finance. Keep your responses concise and easy to understand." }])
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

  return (
    <main className="container mx-auto p-4 max-w-4xl min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Finance Assistant</h1>
      
      <div className="space-y-8 mb-8 h-[calc(100vh-300px)] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>👋 Hi! I&apos;m your finance assistant.</p>
            <p>Ask me anything about finance, investments, or money management!</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`p-4 max-w-[80%] ${
              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </Card>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <Card className="p-4 bg-muted">
              <Loader2 className="h-6 w-6 animate-spin" />
            </Card>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4 sticky bottom-4 bg-background p-4 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about finance..."
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </main>
  )
}
