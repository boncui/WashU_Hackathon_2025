"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, X, Loader2 } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { DecisionReport } from "@/components/decision-report"
import { processStructuredQuery } from "@/lib/agents"
import type { DecisionReportType } from "@/types/types"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { fetchNewsForQuery } from "@/lib/news-service"

export function StructuredChat() {
  // Chat state
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [user, setUser] = useState<{ fullName: string; email: string; _id: string } | null>(null)
  const [currentReport, setCurrentReport] = useState<DecisionReportType | null>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/interests"
  const AUTH_TOKEN_KEY = "omnivia-auth-token"

  // Form state
  const [formStep, setFormStep] = useState(0)
  const [interestType, setInterestType] = useState("transactional")
  const [decision, setDecision] = useState("")
  const [location, setLocation] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [goal, setGoal] = useState("")
  const [newsResults, setNewsResults] = useState<string[]>([])

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (!currentUser) {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentReport, formStep])

  const resetForm = () => {
    setFormStep(0)
    setDecision("")
    setLocation("")
    setTimeframe("")
    setGoal("")
    setNewsResults([])
    setInterestType("transactional")
  }

  const handleSubmitForm = async () => {
    setIsLoading(true)

    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null

    // Construct the full query
    const fullQuery = `Should I ${decision}${location ? ` in ${location}` : ""}${
      timeframe ? ` in the ${timeframe}` : ""
    }${goal ? ` to ${goal}` : ""}?`

    // Add user message to chat (just to track that submission happened)
    setMessages((prev) => [...prev, { role: "user", content: fullQuery }])

    try {
      // Submit the interest
      if (user) {
        const res = await fetch(`${API_BASE_URL}/${user._id}/interests`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: goal || decision, // Use goal if available, otherwise use decision
            type: interestType,
            update: true // Set to true to indicate we want updates
          }),
        })

        if (!res.ok) {
          throw new Error(`Failed to create interest: ${res.status}`)
        }

        // Add assistant confirmation message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Interest added successfully!"
          },
        ])
      }
    } catch (error) {
      console.error("Error processing request:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error adding your interest. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    setFormStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setFormStep((prev) => Math.max(0, prev - 1))
  }

  const exampleQueries = [
    {
      decision: "buy a car",
      location: "Houston, Texas",
      timeframe: "next 6 months",
      goal: "save money on transportation",
    },
    {
      decision: "switch jobs",
      location: "remote work",
      timeframe: "next quarter",
      goal: "increase my salary by 20%",
    },
    {
      decision: "invest in cryptocurrency",
      location: "",
      timeframe: "next year",
      goal: "diversify my investment portfolio",
    },
    {
      decision: "relocate to Austin",
      location: "Austin, Texas",
      timeframe: "next summer",
      goal: "improve my quality of life",
    },
  ]

  const formSteps = [
    {
      title: "What decision are you considering?",
      description: "Start with 'Should I...' and describe the decision you're trying to make",
      field: "decision",
      value: decision,
      setValue: setDecision,
      placeholder: "buy a house, change careers, invest in stocks...",
      examples: exampleQueries.map((q) => q.decision),
    },
    {
      title: "What's your interest superpower?",
      description: "Tell us how you want to engage with this topic",
      field: "interestType",
      value: interestType,
      setValue: setInterestType,
      type: "radio", // Use radio buttons instead of text input
      options: [
        {
          value: "transactional",
          label: "💰 Deal Hunter",
          description: "I'm planning to buy, sell, or make a transaction"
        },
        {
          value: "informational",
          label: "🔮 Knowledge Keeper",
          description: "I just want to follow and stay informed"
        }
      ],
      examples: [], // No examples needed for radio selection
    },
    {
      title: "Where are you located?",
      description: "This helps us provide location-specific insights (optional)",
      field: "location",
      value: location,
      setValue: setLocation,
      placeholder: "New York City, Remote, Online...",
      examples: exampleQueries.map((q) => q.location).filter(Boolean),
    },
    {
      title: "What's your timeframe?",
      description: "When are you planning to make this decision?",
      field: "timeframe",
      value: timeframe,
      setValue: setTimeframe,
      placeholder: "next month, within a year, immediately...",
      examples: exampleQueries.map((q) => q.timeframe),
    },
    {
      title: "What's your goal?",
      description: "What are you hoping to achieve with this decision?",
      field: "goal",
      value: goal,
      setValue: setGoal,
      placeholder: "save money, advance my career, improve health...",
      examples: exampleQueries.map((q) => q.goal),
    },
  ]

  const renderFormStep = () => {
    const currentStep = formSteps[formStep]

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-1">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </div>

        {currentStep.type === "radio" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {currentStep.options.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${
                    currentStep.value === option.value ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                  onClick={() => currentStep.setValue(option.value)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        type="radio"
                        id={option.value}
                        name={currentStep.field}
                        value={option.value}
                        checked={currentStep.value === option.value}
                        onChange={() => currentStep.setValue(option.value)}
                        className="h-4 w-4 text-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor={option.value} className="font-medium block cursor-pointer">
                        {option.label}
                      </label>
                      <span className="text-sm text-muted-foreground block mt-1">
                        {option.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : formStep === 0 ? (
          <div className="space-y-2">
            <Label htmlFor={currentStep.field}>Should I...</Label>
            <Input
              id={currentStep.field}
              value={currentStep.value}
              onChange={(e) => currentStep.setValue(e.target.value)}
              placeholder={currentStep.placeholder}
              className="focus-visible:ring-primary"
              autoFocus
            />
          </div>
        ) : formStep === 3 ? (
          <div className="space-y-2">
            <Label htmlFor={currentStep.field}>To...</Label>
            <Textarea
              id={currentStep.field}
              value={currentStep.value}
              onChange={(e) => currentStep.setValue(e.target.value)}
              placeholder={currentStep.placeholder}
              className="focus-visible:ring-primary min-h-[100px]"
              autoFocus
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={currentStep.field}>{formStep === 1 ? "In" : "In the"}</Label>
            <Input
              id={currentStep.field}
              value={currentStep.value}
              onChange={(e) => currentStep.setValue(e.target.value)}
              placeholder={currentStep.placeholder}
              className="focus-visible:ring-primary"
              autoFocus
            />
          </div>
        )}

        {currentStep.examples && currentStep.examples.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Examples</Label>
            <div className="flex flex-wrap gap-2">
              {currentStep.examples.map((example, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => currentStep.setValue(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={handlePrevStep} disabled={formStep === 0}>
            Back
          </Button>

          {formStep < formSteps.length - 1 ? (
            <Button
              onClick={handleNextStep}
              disabled={(formStep === 0 && !decision.trim()) ||
                       (currentStep.type === "radio" && !currentStep.value)}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitForm}
              disabled={!decision.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Get Decision
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  const renderQuerySummary = () => {
    if (!decision) return null

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Should I {decision}
          <button className="ml-1 hover:text-primary" onClick={() => setFormStep(0)}>
            <X className="h-3 w-3" />
          </button>
        </Badge>

        {location && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            in {location}
            <button className="ml-1 hover:text-primary" onClick={() => setFormStep(1)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {timeframe && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            in the {timeframe}
            <button className="ml-1 hover:text-primary" onClick={() => setFormStep(2)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {goal && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            to {goal}
            <button className="ml-1 hover:text-primary" onClick={() => setFormStep(3)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    )
  }

  // Render function with all conditional rendering
  // Inside the renderContent function, replace the existing chat content with this simpler confirmation message
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    return (
      <div className="flex flex-col w-full min-h-[600px] rounded-lg overflow-hidden border">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-medium">Add Interest</h2>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {messages.length > 0 ? (
            // Show confirmation message after form submission
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interest Added Successfully!</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                We've received your interest in "{goal}" and will gather relevant news and insights for you.
                Check your feed shortly to see personalized updates.
              </p>
              <Button
                onClick={resetForm}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Add Another Interest
              </Button>
            </div>
          ) : (
            // Show the form when no submission has been made yet
            <div className="h-full flex flex-col p-4">
              {renderQuerySummary()}

              {formStep < formSteps.length ? (
                renderFormStep()
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">What are you interested in?</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Tell us about your interests so we can provide relevant news and insights.
                  </p>
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    {exampleQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left text-sm"
                        onClick={() => {
                          setDecision(query.decision)
                          setLocation(query.location)
                          setTimeframe(query.timeframe)
                          setGoal(query.goal)
                          setFormStep(formSteps.length)
                        }}
                      >
                        Should I {query.decision}
                        {query.location ? ` in ${query.location}` : ""}
                        {query.timeframe ? ` in the ${query.timeframe}` : ""}
                        {query.goal ? ` to ${query.goal}` : ""}?
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Always return from the main component function
  return renderContent()
}