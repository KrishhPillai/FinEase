'use client'

import { useState, useEffect } from 'react'

export default function ChatBotPage({ title, desc }: { title: string, desc: string }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! How can I assist you today?", sender: "ai" },
  ])
  const [userInput, setUserInput] = useState('')
  const [userDetails, setUserDetails] = useState<any>(null)

  
  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://65.1.209.37:8080/user-details?email=test@example.com`)
        if (response.ok) {
          const data = await response.json()
          setUserDetails(data)
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }
    fetchUserDetails()
  }, [])

  // Send initial message
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (title && desc) {
        const initialMessage = `Explain about: ${title} using ${desc}`
        setMessages((prev) => [...prev, { id: prev.length + 1, text: initialMessage, sender: "user" }])

        try {
          const response = await fetch('http://65.1.209.37:1234/aayush-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: initialMessage }),
          })

          if (response.ok) {
            const data = await response.json()
            setMessages((prev) => [
              ...prev,
              { id: prev.length + 2, text: data.response || "Couldn't fetch a response.", sender: "ai" },
            ])
          } else {
            console.error(`Error: ${response.status} ${response.statusText}`)
          }
        } catch (error) {
          console.error("Error sending initial message:", error)
        }
      }
    }

    sendInitialMessage()
  }, [title, desc])

  // Send user message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    setMessages((prev) => [...prev, { id: prev.length + 1, text: userInput, sender: "user" }])
    setUserInput('')

    if (userDetails) {
      try {
        const response = await fetch('http://65.1.209.37:1234/aayush-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: userInput }),
        })

        if (response.ok) {
          const data = await response.json()
          setMessages((prev) => [
            ...prev,
            { id: prev.length + 2, text: data.response || "Couldn't fetch a response.", sender: "ai" },
          ])
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`)
        }
      } catch {
        console.error("Network error")
      }
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-80 flex flex-col">
      {/* Header */}

      {/* Messages Section */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-3 py-2 rounded-md max-w-[80%] text-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <form onSubmit={sendMessage} className="flex gap-2 p-2 border-t dark:border-gray-700">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-1 rounded-md text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  )
}