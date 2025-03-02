'use client'

import TransactionDashboard from '../../components/TransactionDashboard'

export default function DashboardPage() {
  function getGreeting() {
    const hours = new Date().getHours()
    if (hours < 12) {
      return 'Good Morning'
    } else if (hours < 18) {
      return 'Good Afternoon'
    } else {
      return 'Good Evening'
    }
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const username = 'User'
  const greeting = getGreeting()
  const currentDate = formatDate(new Date())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        {greeting}, {username}!
      </h1>
      <p className="text-secondary-foreground mb-6">{currentDate}</p>
      <TransactionDashboard/>
    </div>
  )
} 