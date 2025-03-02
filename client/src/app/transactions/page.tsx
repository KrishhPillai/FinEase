'use client'

import TransactionDashboard from '@/components/TransactionDashboard'

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <TransactionDashboard />
      </div>
    </main>
  )
} 