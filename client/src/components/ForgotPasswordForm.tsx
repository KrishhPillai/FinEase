'use client'

import { useState } from 'react'
import { forgotPassword } from '@/app/actions'
import toast from 'react-hot-toast'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await forgotPassword(email)
      if (result.success) {
        toast.success('Reset password link has been sent to your email address')
        setEmail('')
      } else {
        toast.error(result.error || 'Failed to send reset email')
      }
    } catch  {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </div>

      <div className="text-center">
        <a
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to login
        </a>
      </div>
    </form>
  )
} 