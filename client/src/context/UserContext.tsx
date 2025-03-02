'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UserContextType {
  email: string | null
  setEmail: (email: string | null) => void
  showDetailsModal: boolean
  setShowDetailsModal: (show: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  return (
    <UserContext.Provider value={{
      email,
      setEmail,
      showDetailsModal,
      setShowDetailsModal,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 