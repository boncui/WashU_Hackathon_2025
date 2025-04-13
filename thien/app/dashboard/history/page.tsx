import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/auth"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"

export default async function HistoryPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
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
                <h2 className="text-2xl font-bold tracking-tight">Decision History</h2>
                <p className="text-muted-foreground">View and manage your past decisions</p>
              </div>
              <Link href="/dashboard/chat">
                <Button>New Decision</Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search decisions..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
                <span className="sr-only">Sort</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Decisions</CardTitle>
                <CardDescription>Your complete decision history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      question: "Should I invest in the stock market now?",
                      date: "Apr 10, 2025",
                      verdict: "Yes",
                      confidence: 75,
                      category: "Finance",
                    },
                    {
                      question: "Should I relocate to Austin for a new job?",
                      date: "Apr 5, 2025",
                      verdict: "Depends",
                      confidence: 60,
                      category: "Career",
                    },
                    {
                      question: "Is now a good time to buy a car?",
                      date: "Mar 29, 2025",
                      verdict: "No",
                      confidence: 82,
                      category: "Automotive",
                    },
                    {
                      question: "Should I refinance my mortgage?",
                      date: "Mar 22, 2025",
                      verdict: "Yes",
                      confidence: 88,
                      category: "Real Estate",
                    },
                    {
                      question: "Is it worth investing in cryptocurrency right now?",
                      date: "Mar 15, 2025",
                      verdict: "Depends",
                      confidence: 55,
                      category: "Finance",
                    },
                    {
                      question: "Should I start a side business?",
                      date: "Mar 8, 2025",
                      verdict: "Yes",
                      confidence: 70,
                      category: "Career",
                    },
                  ].map((decision, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="font-medium">{decision.question}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{decision.date}</span>
                          <span>•</span>
                          <span>{decision.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
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
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}
