'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions'
import toast from 'react-hot-toast'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      const result = await logout()
      if (result.success) {
        toast.success('Logged out successfully')
        router.push('/login')
      } else {
        toast.error('Failed to logout. Please try again.')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

