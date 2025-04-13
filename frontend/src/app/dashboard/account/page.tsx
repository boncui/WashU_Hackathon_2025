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
                <div className="flex flex-col items-center gap-2 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user._id}`}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Change profile photo (coming soon)</p>
                </div>

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

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Social Connections</CardTitle>
                    <CardDescription>Your network of friends and followed users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Friend Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.currentTarget
                        const formData = new FormData(form)
                        const email = formData.get("friendEmail")?.toString().trim()

                        if (!email || !user) return

                        try {
                          const res = await fetch(`http://localhost:5001/users/${user._id}/follow-by-email`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                          })

                          const data = await res.json()
                          if (!res.ok) throw new Error(data.error || "Could not follow user")

                          alert(`✅ You are now following ${email}`)
                          form.reset()
                        } catch (err) {
                          alert(`❌ ${err instanceof Error ? err.message : "Unknown error"}`)
                        }
                      }}
                      className="space-y-2"
                    >
                      <Label htmlFor="friendEmail">Add a friend by email</Label>
                      <div className="flex gap-2">
                        <Input
                          id="friendEmail"
                          name="friendEmail"
                          type="email"
                          placeholder="friend@example.com"
                          required
                        />
                        <Button type="submit">Add</Button>
                      </div>
                    </form>
                    <div>
                      <Label>Friends</Label>
                      <div className="text-sm text-muted-foreground">No friends yet. Start connecting!</div>
                    </div>
                    <div>
                      <Label>Following</Label>
                      <div className="text-sm text-muted-foreground">You’re not following anyone.</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* NOTIFICATIONs */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["Email Notifications", "Decision Reminders", "Marketing Communications"].map((title, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{title}</Label>
                          <p className="text-sm text-muted-foreground">Notification about {title.toLowerCase()}</p>
                        </div>
                        <Switch defaultChecked={i !== 2} />
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
                        {["5 decisions per month", "Basic market data", "7-day decision history"].map((text, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{text}</span>
                          </div>
                        ))}
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
                        {["Unlimited decisions", "Advanced market data", "Unlimited decision history", "Priority support"].map((text, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{text}</span>
                          </div>
                        ))}
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