"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export default function HistoryPage() {
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

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  // Example mock data (replace with real API fetch later)
  const decisionHistory = [
    {
      question: "Should I invest in real estate this year?",
      date: "March 15, 2025",
      verdict: "Yes",
      confidence: 82,
    },
    {
      question: "Should I accept the new job offer?",
      date: "March 2, 2025",
      verdict: "No",
      confidence: 65,
    },
    {
      question: "Is it the right time to start a YouTube channel?",
      date: "February 20, 2025",
      verdict: "Depends",
      confidence: 58,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={{ name: user.fullName, email: user.email }} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell className="mb-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Decision History</h2>
              <p className="text-muted-foreground">All your previous AI-guided decisions</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Decisions</CardTitle>
                <CardDescription>Review past verdicts and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {decisionHistory.map((decision, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-3 ${index !== 0 ? "border-t" : ""}`}
                  >
                    <div>
                      <div className="font-medium">{decision.question}</div>
                      <div className="text-sm text-muted-foreground">{decision.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm px-2 py-1 rounded-full font-medium ${
                          decision.verdict === "Yes"
                            ? "bg-green-500/10 text-green-600"
                            : decision.verdict === "No"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {decision.verdict}
                      </span>
                      <span className="text-sm text-muted-foreground">{decision.confidence}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}
