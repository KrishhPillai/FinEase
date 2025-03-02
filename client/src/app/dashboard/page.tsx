'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import OnboardingModal from '@/components/OnboardingModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CryptoDashboard from '@/components/CryptoDashboard'
import { 
  ArrowRight, 
  WalletCards, 
  PieChart, 
  BookOpen, 
  MessageCircle,
  TrendingUp,
  DollarSign,
  Brain,
  Receipt
} from 'lucide-react'

function DashboardContent() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { email } = useUser()

  useEffect(() => {
    if (searchParams?.get('showOnboarding') === 'true') {
      setShowOnboarding(true)
    }
  }, [searchParams])

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

  const navigationCards = [
    {
      title: 'Transactions',
      description: 'Track your spending, analyze patterns, and manage your budget with our comprehensive transaction dashboard.',
      icon: WalletCards,
      path: '/transactions',
      color: 'bg-blue-500/10 text-blue-500',
      highlight: 'hover:border-blue-500/20',
    },
    {
      title: 'Portfolio',
      description: 'View your investment portfolio, track performance, and analyze your asset allocation.',
      icon: PieChart,
      path: '/portfolio',
      color: 'bg-green-500/10 text-green-500',
      highlight: 'hover:border-green-500/20',
    },
    {
      title: 'Learn',
      description: 'Explore educational resources, investment strategies, and financial planning guides.',
      icon: BookOpen,
      path: '/learn',
      color: 'bg-purple-500/10 text-purple-500',
      highlight: 'hover:border-purple-500/20',
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized financial advice and answers to your questions from our AI assistant.',
      icon: MessageCircle,
      path: '/chat',
      color: 'bg-orange-500/10 text-orange-500',
      highlight: 'hover:border-orange-500/20',
    },
    {
      title: 'Tax Management',
      description: 'Analyze your Tax and optimize to reduce tax liability',
      icon: DollarSign,
      path: '/tax',
      color: 'bg-red-500/10 text-red-500',
      highlight: 'hover:border-red-500/20',
    },
    {
      title: 'EMI Calculation',
      description: 'Calculate EMI, see breakdown, and analyze amortization schedule',
      icon: Receipt,
      path: '/emi-calculator',
      color: 'bg-yellow-500/10 text-yellow-500',
      highlight: 'hover:border-yellow-500/20',
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {username}!
          </h1>
          <p className="text-secondary-foreground">{currentDate}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12,234.56</div>
              <p className="text-xs text-muted-foreground">+4.3% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12/20</div>
              <p className="text-xs text-muted-foreground">Modules completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Questions answered</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {navigationCards.map((card) => (
            <Card 
              key={card.title}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border border-transparent ${card.highlight}`}
              onClick={() => router.push(card.path)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>
                <div className="flex items-center text-primary">
                  Open {card.title} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Crypto Dashboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Cryptocurrency Market</h2>
          <CryptoDashboard />
        </div>
      </div>

      {showOnboarding && email && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          email={email}
        />
      )}
    </main>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
} 