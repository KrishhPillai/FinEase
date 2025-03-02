'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TopicChatProps {
  title: string
  description: string
}

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
}

export default function TopicChat({ title, description }: TopicChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatSession, setChatSession] = useState<any>(null)

  useEffect(() => {
    // Initialize Gemini API on the client side
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const session = model.startChat({
      generationConfig,
      history: [],
    })

    // Set initial context
    session.sendMessage([{
      text: `You are a finance education assistant focused on teaching about ${title}. 
      Here's the context: ${description}
      Keep your responses concise, easy to understand, and focused on ${title}.
      If asked about other topics, politely redirect to ${title}-related aspects.`
    }])

    setChatSession(session)
  }, [title, description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !chatSession) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
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
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 space-y-4 overflow-y-auto mb-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>👋 Hi! I&apos;m your {title} expert.</p>
            <p>Ask me anything about {title}!</p>
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
              <ReactMarkdown className="whitespace-pre-wrap prose dark:prose-invert max-w-none">
                {message.content}
              </ReactMarkdown>
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

      <form onSubmit={handleSubmit} className="flex gap-4 p-4 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${title}...`}
          className="flex-1"
          disabled={loading || !chatSession}
        />
        <Button type="submit" disabled={loading || !chatSession}>
          Send
        </Button>
      </form>
    </div>
  )
} 