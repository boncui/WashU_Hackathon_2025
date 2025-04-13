"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, Sparkles } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { DecisionReport } from "@/components/decision-report"
import { processDecisionQuery } from "@/lib/agents"
import type { DecisionReportType } from "@/types/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Chat() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [currentReport, setCurrentReport] = useState<DecisionReportType | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentReport])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      // Process the query through our agent system
      const report = await processDecisionQuery(userMessage)

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've analyzed your question: "${userMessage}". Here's my recommendation based on your goals and current market conditions.`,
        },
      ])

      // Set the report data
      setCurrentReport(report)
    } catch (error) {
      console.error("Error processing query:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQueries = [
    "Is now a good time to buy a car?",
    "Should I switch jobs this quarter?",
    "Is it a smart move to relocate to Austin right now?",
    "Should I invest in the stock market now or wait?",
  ]

  return (
    <div className="flex flex-col h-[600px] rounded-lg overflow-hidden border">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-medium">Add Interests</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent
            value="chat"
            className="flex-1 flex flex-col h-full m-0 p-0 data-[state=active]:flex data-[state=inactive]:hidden"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} role={message.role} content={message.content} />
                  ))}
                  {currentReport && <DecisionReport report={currentReport} />}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ask me about timing your decisions</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    I'll analyze your goals and current market conditions to help you decide.
                  </p>
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    {exampleQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left text-sm"
                        onClick={() => {
                          setInput(query)
                        }}
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-4 py-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Should I..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90"
                  disabled={isLoading || !input.trim()}
                >
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent
            value="history"
            className="h-full flex-1 p-4 m-0 data-[state=active]:flex data-[state=inactive]:hidden"
          >
            <div className="h-full flex flex-col justify-center items-center text-center">
              <p className="text-muted-foreground">Your decision history will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
