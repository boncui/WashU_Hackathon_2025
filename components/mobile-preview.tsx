"use client"

import { useState, useEffect } from "react"
import { HelpCircle, Sparkles, User, ArrowRight } from "lucide-react"

export function MobilePreview() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentScreen((prev) => (prev + 1) % 3)
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const screens = [
    // Welcome screen
    <div key="welcome" className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-cyan-900/20 z-0"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-3xl opacity-30"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ShouldIQ</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              Evolve your decisions
            </span>
          </h1>
          <p className="text-gray-300 mb-8 max-w-xs">Get AI-powered insights for your most important life choices</p>
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium">
            Get Started
          </button>
        </div>

        <div className="p-6 text-center text-sm text-gray-400">Swipe up to explore</div>
      </div>
    </div>,

    // Chat screen
    <div key="chat" className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">ShouldIQ</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-1 max-w-[80%]">
            <div className="text-xs text-gray-400">You</div>
            <div className="text-sm rounded-2xl px-4 py-2 inline-block bg-purple-600 text-white">
              Should I invest in the stock market now?
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-purple-400" />
          </div>
          <div className="space-y-1 max-w-[80%]">
            <div className="text-xs text-gray-400">ShouldIQ</div>
            <div className="text-sm rounded-2xl px-4 py-2 inline-block bg-gray-800 text-white">
              I've analyzed your question. Here's my recommendation based on your goals and current market conditions.
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-green-900/30 text-green-400 border-green-800/30 rounded-full text-sm font-medium">
              Yes
            </div>
            <span className="text-xs text-gray-400">
              with <span className="font-medium text-green-400">75%</span> confidence
            </span>
          </div>
          <div className="text-sm text-gray-300">
            Based on current market conditions and your long-term goals, now is a good time to start investing,
            especially if you plan to hold for 5+ years.
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
          <input
            placeholder="Should I..."
            className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-400 text-sm focus:outline-none"
          />
          <button className="rounded-full bg-purple-600 w-8 h-8 flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>,

    // Report screen
    <div key="report" className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">ShouldIQ</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="p-4 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl">
          <div className="space-y-4">
            <div>
              <div className="text-lg font-bold mb-1">Investment Decision</div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-green-900/30 text-green-400 border-green-800/30 rounded-full text-sm font-medium">
                  Yes
                </div>
                <span className="text-xs text-gray-400">
                  with <span className="font-medium text-green-400">75%</span> confidence
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Market Factors
              </div>
              <div className="space-y-2">
                <div className="bg-gray-800 p-3 rounded-lg text-xs flex items-start gap-2">
                  <div>
                    <div className="font-medium text-gray-200">S&P 500 Performance</div>
                    <div className="text-gray-400">Showing signs of recovery after recent correction</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-xs flex items-start gap-2">
                  <div>
                    <div className="font-medium text-gray-200">Interest Rates</div>
                    <div className="text-gray-400">Expected to stabilize in coming months</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Recommendation</div>
              <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300">
                <p>
                  Consider a dollar-cost averaging approach, investing a fixed amount regularly rather than all at once.
                  Focus on diversified index funds for lower risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ]

  return (
    <div className="relative mx-auto">
      <div className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-xl flex justify-center">
          <div className="w-20 h-4 bg-black rounded-b-xl"></div>
        </div>
        <div
          className={`w-full h-full overflow-hidden bg-[#121212] text-white transition-opacity duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          {screens[currentScreen]}
        </div>
      </div>
    </div>
  )
}
