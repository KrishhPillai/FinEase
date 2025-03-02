'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionBarChart from '@/components/TransactionBarChart'
import TransactionLineChart from '@/components/TransactionLineChart'
import TransactionPieChart from '@/components/TransactionPieChart'
import TransactionSummary from '@/components/TransactionSummary'
import { generateMockTransactions } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/types'
import { useCurrency } from '@/context/CurrencyContext'

export default function TransactionDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions())
  const { formatAmount } = useCurrency()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      
      const parsedTransactions: Transaction[] = lines
        .slice(1) // Skip header row
        .filter(line => line.trim()) // Skip empty lines
        .map((line, index) => {
          const values = line.split(',')
          return {
            id: `transaction-${index}`,
            date: new Date(values[0]),
            type: values[1] as 'credit' | 'debit',
            amount: parseFloat(values[2]),
            category: values[3].trim()
          }
        })

      setTransactions(parsedTransactions)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <Button
            onClick={() => document.getElementById('csv-upload')?.click()}
            variant="outline"
          >
            Upload CSV
          </Button>
          <Button
            onClick={() => setTransactions(generateMockTransactions())}
            variant="outline"
          >
            Use Sample Data
          </Button>
        </div>
      </div>

      <TransactionSummary transactions={transactions} formatAmount={formatAmount} />

      {/* Tabs for medium screens */}
      <div className="md:hidden">
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar">
            <Card>
              <CardHeader>
                <CardTitle>Credit vs Debit Transactions</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <TransactionBarChart transactions={transactions} formatAmount={formatAmount} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="line">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Trends</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <TransactionLineChart transactions={transactions} formatAmount={formatAmount} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pie">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Categories</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <TransactionPieChart transactions={transactions} formatAmount={formatAmount} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* All charts side by side for large screens */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Credit vs Debit Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TransactionBarChart transactions={transactions} formatAmount={formatAmount} />
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Transaction Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TransactionLineChart transactions={transactions} formatAmount={formatAmount} />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Transaction Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TransactionPieChart transactions={transactions} formatAmount={formatAmount} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}