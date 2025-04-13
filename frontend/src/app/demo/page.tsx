import { StructuredChat } from "@/components/dashboard_chat/structured-chat"
import { Button } from "@/components/ui/button"
import { HelpCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function DemoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto p-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Try Omnivia Demo</h1>
          <p className="text-muted-foreground">
            Experience how Omnivia can help you make better decisions. This is a limited demo with 3 free queries.
          </p>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <StructuredChat />
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Want unlimited decisions and advanced features?</p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity">
              Create a free account
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        Omnivia © {new Date().getFullYear()} - Your personal decision-making assistant
        </div>
      </footer>
    </div>
  )
}
