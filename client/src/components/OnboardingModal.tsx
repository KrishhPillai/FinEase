'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export default function OnboardingModal({ isOpen, onClose, email }: OnboardingModalProps) {
  const [experience, setExperience] = useState<string>('')
  const [investingquota, setinvestingquota] = useState<string>('')
  const [riskApettite, setriskApettite] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!experience || !investingquota || !riskApettite) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://65.1.209.37:8080/update-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          experience,
          investingquota: parseInt(investingquota),
          riskApettite,
        }),
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        router.push('/dashboard')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Investment Experience</label>
            <div className="flex gap-2">
              {['novice', 'beginner', 'advanced'].map((level) => (
                <Button
                  key={level}
                  variant={experience === level ? 'default' : 'outline'}
                  onClick={() => setExperience(level)}
                  className="flex-1 capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Investing Quota */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Investment Amount (₹)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={investingquota}
              onChange={(e) => setinvestingquota(e.target.value)}
              min="0"
            />
          </div>

          {/* Risk Appetite */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Appetite</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((level) => (
                <Button
                  key={level}
                  variant={riskApettite === level ? 'default' : 'outline'}
                  onClick={() => setriskApettite(level)}
                  className="flex-1 capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 