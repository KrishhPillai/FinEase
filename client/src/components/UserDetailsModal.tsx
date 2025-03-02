'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export default function UserDetailsModal({ isOpen, onClose, email }: UserDetailsModalProps) {
  const [salary, setSalary] = useState('')
  const [riskAppetite, setRiskAppetite] = useState('medium')
  const [accountNumber, setAccountNumber] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    setLoading(true)

    const payload = {
      email,
      accountNumber: parseInt(accountNumber),
      riskAppetite,
      salary: parseInt(salary)
    }

    console.log('Sending request with payload:', payload)

    try {
      const response = await fetch('http://65.1.209.37:8080/update-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      // Handle 204 No Content as success
      if (response.status === 204) {
        toast.success('Details updated successfully')
        onClose()
        return
      }

      if (response.ok) {
        toast.success('Details updated successfully')
        onClose()
      } else {
        let errorMessage = `Error: ${response.status} ${response.statusText}`
        try {
          const data = await response.text()
          console.log('Error response body:', data)
          if (data) {
            try {
              const jsonData = JSON.parse(data)
              errorMessage = jsonData.message || errorMessage
            } catch {
              errorMessage = data
            }
          }
        } catch (e) {
          console.error('Error parsing response:', e)
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Network error:', error)
      toast.error('Network error occurred. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monthly Salary
            </label>
            <input
              type="number"
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Risk Appetite
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRiskAppetite('low')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${riskAppetite === 'low'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setRiskAppetite('medium')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${riskAppetite === 'medium'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setRiskAppetite('high')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${riskAppetite === 'high'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                High
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Number
            </label>
            <input
              type="number"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 