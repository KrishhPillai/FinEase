'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserDetails {
  experience: string
  investingquota: number
  riskApettite: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Get email from cookie
    const userEmail = document.cookie
      .split('; ')
      .find(row => row.startsWith('userEmail='))
      ?.split('=')[1]
    
    if (userEmail) {
      setEmail(decodeURIComponent(userEmail))
    }
  }, [])

  useEffect(() => {
    async function fetchUserDetails() {
      if (!email) return
      
      try {
        const response = await fetch('http://65.1.209.37:8080/user-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user details')
        }

        const data = await response.json()
        setUserDetails({
          experience: data.experience,
          investingquota: data.investingquota,
          riskApettite: data.riskApettite,
        })
      } catch (error) {
        toast.error('Failed to load profile data')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [email])

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-lg font-medium">{email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Experience Level</label>
                <p className="text-lg font-medium capitalize">{userDetails.experience}</p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Monthly Investment Quota</label>
                <p className="text-lg font-medium">₹{userDetails.investingquota.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Risk Appetite</label>
                <p className="text-lg font-medium capitalize">{userDetails.riskApettite}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 