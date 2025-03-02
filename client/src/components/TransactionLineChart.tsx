'use client'

import { Transaction } from '@/lib/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface TransactionLineChartProps {
  transactions: Transaction[]
  formatAmount: (amount: number) => string
}

export default function TransactionLineChart({ transactions, formatAmount }: TransactionLineChartProps) {
  // Process data for the chart
  const data = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString()
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0
      const newBalance = transaction.type === 'credit' 
        ? lastBalance + transaction.amount 
        : lastBalance - transaction.amount

      acc.push({
        date,
        balance: newBalance
      })

      return acc
    }, [] as { date: string; balance: number }[])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => formatAmount(value)} />
        <Tooltip 
          formatter={(value: number) => formatAmount(value)}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="balance" 
          name="Balance" 
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}