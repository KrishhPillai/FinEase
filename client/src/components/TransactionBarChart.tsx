'use client'

import { Transaction } from '@/lib/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface TransactionBarChartProps {
  transactions: Transaction[]
  formatAmount: (amount: number) => string
}

export default function TransactionBarChart({ transactions, formatAmount }: TransactionBarChartProps) {
  // Process data for the chart
  const data = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString()
    const existingDay = acc.find(d => d.date === date)

    if (existingDay) {
      if (transaction.type === 'credit') {
        existingDay.credit += transaction.amount
      } else {
        existingDay.debit += transaction.amount
      }
    } else {
      acc.push({
        date,
        credit: transaction.type === 'credit' ? transaction.amount : 0,
        debit: transaction.type === 'debit' ? transaction.amount : 0
      })
    }

    return acc
  }, [] as { date: string; credit: number; debit: number }[])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => formatAmount(value)} />
        <Tooltip 
          formatter={(value: number) => formatAmount(value)}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Bar dataKey="credit" name="Credit" fill="#22c55e" />
        <Bar dataKey="debit" name="Debit" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}