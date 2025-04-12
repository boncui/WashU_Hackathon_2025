"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 bg-[#1E1E1E] sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ShouldIQ</span>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#demo" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Demo
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Examples
          </Link>
          <Button size="sm" variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#1E1E1E] border-b border-gray-800 p-4 flex flex-col gap-4">
            <Link
              href="#demo"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Examples
            </Link>
            <Button size="sm" variant="outline" className="text-white border-gray-700 hover:bg-gray-800 w-full">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition-opacity w-full"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
