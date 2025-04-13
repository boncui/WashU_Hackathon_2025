"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { HelpCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from "@/lib/auth"
import Image from "next/image"

interface DashboardHeaderProps {
  user: {
    name: string
    email: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  // 🧠 Developer-friendly validation
  if (!user?.name || !user?.email) {
    throw new Error("DashboardHeader: Missing required `user` prop.")
  }

  // ✅ Safe fallback for initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
        <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="relative w-8 h-8 rounded bg-white overflow-hidden">
              <Image
                src="/logo.png"
                alt="Omnia logo"
                fill
                className="object-contain invert dark:invert-0"
                sizes="80%"
              />
            </div>
            <span className="text-xl font-bold">Omnia</span>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/history">Decision History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault()
                  handleSignOut()
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
