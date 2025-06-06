"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { BarChart, Clock, Zap, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { User } from "@/types/user"
import Image from "next/image"
import { InterestList } from "@/components/dashboard/interestList"
import { getAuthToken } from "@/lib/auth"           // ← add this

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth/login")
          return
        }
        setUser(currentUser)
      } catch (err) {
        console.error("Error fetching user:", err)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
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
      return null
    }

    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={{ name: user.fullName, email: user.email }} />
        <div className="container flex-1 items-start md:grid md:grid-cols-[180px_1fr] md:gap-6 lg:grid-cols-[180px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <DashboardShell className="mb-14">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user.fullName}</h2>
                  <p className="text-muted-foreground">Enjoy your personalized news feed!</p>
                </div>
                <Link href="/dashboard/chat">
                  <Button>Add Interest</Button>
                </Link>
              </div>

              {/* Activity */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Your Interests */}
                <Card className="col-span-12">
                  <CardHeader>
                    <CardTitle>Your Interests</CardTitle>
                    <CardDescription>Categories you follow to stay informed</CardDescription>
                  </CardHeader>
                  <CardContent>
                  {user && (
                    <InterestList
                      userId={user._id}
                      token={getAuthToken() ?? ""}                  // ← pass Bearer token
                    />
                  )}
                  </CardContent>
                </Card>

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

// 🔧 Helper component for stat blocks
function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string
  value: string
  icon: React.ReactNode
  subtitle: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}