import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FinEase - Authentication",
  description: "Sign in or create an account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <div className="w-full">{children}</div>
    </div>
  )
} 