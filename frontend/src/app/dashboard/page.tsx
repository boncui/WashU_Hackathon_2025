"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { BarChart, Clock, Zap, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null)
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
    return null // Router will redirect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell className="mb-14">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}</h2>
                <p className="text-muted-foreground">Here's an overview of your decision-making activity</p>
              </div>
              <Link href="/dashboard/chat">
                <Button>New Decision</Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Decisions Made</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Decisions Remaining</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">On free plan (5/mo)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Finance</div>
                  <p className="text-xs text-muted-foreground">5 decisions this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Free</div>
                  <Link href="/dashboard/settings" className="text-xs text-primary hover:underline">
                    Upgrade to Pro
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Decisions</CardTitle>
                  <CardDescription>Your most recent decision-making activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {[
                    {
                      question: "Should I invest in the stock market now?",
                      date: "2 days ago",
                      verdict: "Yes",
                      confidence: 75,
                    },
                    {
                      question: "Should I relocate to Austin for a new job?",
                      date: "1 week ago",
                      verdict: "Depends",
                      confidence: 60,
                    },
                    {
                      question: "Is now a good time to buy a car?",
                      date: "2 weeks ago",
                      verdict: "No",
                      confidence: 82,
                    },
                  ].map((decision, i) => (
                    <div key={i} className={`flex items-center justify-between py-3 ${i !== 0 ? "border-t" : ""}`}>
                      <div>
                        <div className="font-medium">{decision.question}</div>
                        <div className="text-sm text-muted-foreground">{decision.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            decision.verdict === "Yes"
                              ? "bg-green-500/10 text-green-500"
                              : decision.verdict === "No"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {decision.verdict}
                        </div>
                        <div className="text-sm text-muted-foreground">{decision.confidence}%</div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 text-center">
                    <Link href="/dashboard/history">
                      <Button variant="outline" size="sm">
                        View all decisions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Suggested Decisions</CardTitle>
                  <CardDescription>Questions you might want to explore</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Should I refinance my mortgage with current interest rates?",
                      "Is it a good time to start a side business?",
                      "Should I invest in renewable energy stocks?",
                    ].map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm">{suggestion}</div>
                      </div>
                    ))}
                    <Link href="/dashboard/chat">
                      <Button className="w-full mt-2">Ask a question</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}
