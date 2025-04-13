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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { fetchNewsForQuery } from "@/lib/news-service"

export function StructuredChat() {
  // Chat state
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [currentReport, setCurrentReport] = useState<DecisionReportType | null>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Form state
  const [formStep, setFormStep] = useState(0)
  const [decision, setDecision] = useState("")
  const [location, setLocation] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [goal, setGoal] = useState("")
  const [newsResults, setNewsResults] = useState<string[]>([])

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
  }

  const handleSubmitForm = async () => {
    setIsLoading(true)

    // Construct the full query
    const fullQuery = `Should I ${decision}${location ? ` in ${location}` : ""}${
      timeframe ? ` in the ${timeframe}` : ""
    }${goal ? ` to ${goal}` : ""}?`

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: fullQuery }])

    try {
      // Fetch relevant news
      const news = await fetchNewsForQuery(decision, location)
      setNewsResults(news)

      // Add a message about the news research
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm researching current news and market data relevant to your decision...",
        },
      ])

      // Process the structured query
      const report = await processStructuredQuery({
        decision,
        location,
        timeframe,
        goal,
        newsContext: news,
      })

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've analyzed your question: "${fullQuery}". Here's my recommendation based on your goals, location factors, timeframe, and current market conditions.`,
        },
      ])

      // Set the report data
      setCurrentReport(report)

      // Reset form for next query
      resetForm()
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

        {formStep === 0 ? (
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

        {currentStep.examples.length > 0 && (
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
            <Button onClick={handleNextStep} disabled={formStep === 0 && !decision.trim()}>
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

  return (
    <div className="flex flex-col h-[600px] rounded-lg overflow-hidden border">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-medium">Ask ShouldIQ</h2>
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

                  {newsResults.length > 0 && !currentReport && (
                    <Card className="bg-muted/30 border-primary/10">
                      <CardContent className="p-4 space-y-2">
                        <h4 className="text-sm font-medium">Relevant News & Market Data</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {newsResults.map((news, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{news}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {currentReport && <DecisionReport report={currentReport} />}

                  {!isLoading && !currentReport && messages.length > 0 && (
                    <div className="pt-4">
                      <Button onClick={resetForm} variant="outline" className="w-full">
                        Ask another question
                      </Button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex flex-col p-4">
                  {renderQuerySummary()}

                  {formStep < formSteps.length ? (
                    renderFormStep()
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
