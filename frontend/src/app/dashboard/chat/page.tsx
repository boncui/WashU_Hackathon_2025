"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import { StructuredChat } from "@/components/structured-chat"
import { getCurrentUser } from "@/lib/auth"

export default function ChatPage() {
  const [user, setUser] = useState<{ fullName: string; email: string; _id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)

      if (!currentUser) {
        router.push("/login")
      }
    }

    loadUser()
  }, [router])

  // Render function with all conditional rendering inside
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    if (!user) {
      return null // Router will redirect
    }

    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={{ name: user.fullName, email: user.email }} />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <DashboardShell className="mb-14">
              <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
                <div className="w-full">
                  <StructuredChat />
                </div>
              </div>
            </DashboardShell>
          </main>
        </div>
      </div>
    )
  }

  // Always return from the main component function
  return renderContent()
}