'use client'

import LoginForm from "@/components/LoginForm"
import { motion } from "framer-motion"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">FinEase</h1>
          <p className="text-muted-foreground mt-2">Your Financial Assistant</p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  )
} 