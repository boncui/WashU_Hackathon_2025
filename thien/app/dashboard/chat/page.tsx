import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/dashboard/nav"
import { StructuredChat } from "@/components/structured-chat"
import { getCurrentUser } from "@/lib/auth"

export default async function ChatPage() {
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
