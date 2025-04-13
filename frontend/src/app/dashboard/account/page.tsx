"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser } from "@/lib/auth"
import { CheckCircle } from "lucide-react"

export default function AccountPage() {
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
    return null // Router will redirect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={{ name: user.fullName, email: user.email }} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <DashboardNav />
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardShell className="mb-14">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Account</h2>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>

              {/* ACCOUNT */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label>Name</Label>
                      <p className="text-sm text-muted-foreground">{user.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "Email Notifications",
                        description: "Receive emails about your decisions and account updates",
                        defaultChecked: true,
                      },
                      {
                        title: "Decision Reminders",
                        description: "Get reminders about decisions you've made",
                        defaultChecked: true,
                      },
                      {
                        title: "Marketing Communications",
                        description: "Receive updates about new features and offers",
                        defaultChecked: false,
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label htmlFor={`notification-${i}`}>{item.title}</Label>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch id={`notification-${i}`} defaultChecked={item.defaultChecked} />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button>Save preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium">Free Plan</div>
                          <div className="text-sm text-muted-foreground">Current plan</div>
                        </div>
                        <div className="text-sm font-medium text-green-500">Active</div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">5 decisions per month</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Basic market data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">7-day decision history</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-medium">Pro Plan</div>
                          <div className="text-sm text-muted-foreground">$9.99/month</div>
                        </div>
                        <Button>Upgrade</Button>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Unlimited decisions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Advanced market data</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Unlimited decision history</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Priority support</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}
