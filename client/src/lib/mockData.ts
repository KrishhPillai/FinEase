import { Transaction } from './types'

const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills']

export function generateMockTransactions(count = 100): Transaction[] {
  const transactions: Transaction[] = []
  const startDate = new Date(new Date().getFullYear(), 0, 1)
  const endDate = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
    transactions.push({
      id: `transaction-${i}`,
      type: Math.random() > 0.5 ? 'credit' : 'debit',
      amount: parseFloat((Math.random() * 1000).toFixed(2)),
      date,
      category: categories[Math.floor(Math.random() * categories.length)],
    })
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}