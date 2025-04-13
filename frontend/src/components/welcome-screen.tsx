import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-cyan-900/20 z-0"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-3xl opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ShouldIQ</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              Evolve your decisions
            </span>
          </h1>
          <p className="text-gray-300 mb-8 max-w-xs">Get AI-powered insights for your most important life choices</p>
          <Link href="#demo">
            <Button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-gray-400">Swipe up to explore</div>
      </div>
    </div>
  )
}
