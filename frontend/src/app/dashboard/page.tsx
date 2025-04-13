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
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <DashboardNav />
          <main className="flex w-full flex-col overflow-hidden">
            <DashboardShell className="mb-14">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user.fullName}</h2>
                  <p className="text-muted-foreground">Enjoy your personalized interests board!</p>
                </div>
                <Link href="/dashboard/chat">
                  <Button>Add Interest</Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Interests Investigated" value="12" icon={<BarChart />} subtitle="+2 from last month" />
                <StatCard title="Decisions Remaining" value="3" icon={<Clock />} subtitle="On free plan (5/mo)" />
                <StatCard title="Top Category" value="Finance" icon={<Zap />} subtitle="5 decisions this month" />
                <StatCard title="Subscription" value="Free" icon={<ArrowUpRight />} subtitle={
                  <Link href="/dashboard/settings" className="text-xs text-primary hover:underline">
                    Upgrade to Pro
                  </Link>
                } />
              </div>

              {/* Activity */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/*<Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Interests</CardTitle>
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
                </Card>*/}



                {/* Your Interests */}
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Your Interests</CardTitle>
                    <CardDescription>Categories you follow to stay informed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest) => (
                          <Card key={interest._id} className="bg-muted p-4">
                            <CardTitle className="text-base">{interest.name}</CardTitle>
                            <CardDescription className="text-sm capitalize">{interest.type}</CardDescription>
                            <p className="text-xs text-muted-foreground mt-2">
                              {interest.update ? "✅ Updates enabled" : "🚫 Updates off"}
                            </p>
                          </Card>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">You haven't added any interests yet.</p>
                      )}
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