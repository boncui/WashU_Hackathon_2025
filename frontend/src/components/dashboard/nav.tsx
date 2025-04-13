"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageSquare, History, Settings } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "New Interest",
      href: "/dashboard/chat",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "History",
      href: "/dashboard/history",
      icon: <History className="mr-2 h-4 w-4" />,
    },
    {
      title: "Inbox",
      href: "/dashboard/inbox",
      icon: <History className="mr-2 h-4 w-4" />,
    },
    {
      title: "Account",
      href: "/dashboard/account",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="hidden md:block">
      <div className="space-y-1 py-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href ? "bg-muted" : "")}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
