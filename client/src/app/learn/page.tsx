'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import TopicChat from '@/components/TopicChat'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function LearnPage() {
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<{ title: string; description: string } | null>(null)

  function openTopicChat(title: string, description: string) {
    setSelectedTopic({ title, description })
    setShowChatModal(true)
  }

  const courses = [
    { category: 'Investing', title: 'Stocks', description: 'Stocks represent ownership in a company. When you buy a stock, you are purchasing a small part of that company.' },
    { category: 'Investing', title: 'Bonds', description: 'Bonds are a type of loan made by investors to borrowers, typically corporations or governments.' },
    { category: 'Investing', title: 'Mutual Funds', description: 'Mutual funds pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities.' },
    { category: 'Investing', title: 'ETFs', description: 'ETFs (Exchange-Traded Funds) are investment funds traded on stock exchanges, much like stocks.' },
    { category: 'Wealth Management', title: 'Diversification', description: 'Diversification is a strategy that mixes a wide variety of investments within a portfolio.' },
    { category: 'Wealth Management', title: 'ROI', description: 'ROI (Return on Investment) measures the profitability of an investment as a percentage of the original cost.' },
  ]

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold"
          >
            Learn
          </motion.h1>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-lg shadow overflow-hidden"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                    {course.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {course.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openTopicChat(course.title, course.description)}
                  className="mt-4 w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Chat Modal */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Learn about {selectedTopic?.title}</DialogTitle>
          </DialogHeader>
          {selectedTopic && (
            <TopicChat 
              title={selectedTopic.title} 
              description={selectedTopic.description} 
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}