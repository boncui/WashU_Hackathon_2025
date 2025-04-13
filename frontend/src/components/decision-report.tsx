"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DecisionReportType } from "@/types/types"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3,
  Clock,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useState } from "react"

interface DecisionReportProps {
  report: DecisionReportType
}

export function DecisionReport({ report }: DecisionReportProps) {
  const { verdict, confidence, goalAnalysis, marketFactors, tradeoffs, recommendation } = report
  const [expandedSection, setExpandedSection] = useState<string | null>("market")

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const getVerdictColor = () => {
    switch (verdict) {
      case "Yes":
        return "bg-green-500/10 text-green-500 dark:bg-green-900/30 dark:text-green-400"
      case "No":
        return "bg-red-500/10 text-red-500 dark:bg-red-900/30 dark:text-red-400"
      case "Depends":
        return "bg-amber-500/10 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getConfidenceColor = () => {
    if (confidence >= 80) return "text-green-500 dark:text-green-400"
    if (confidence >= 60) return "text-primary"
    if (confidence >= 40) return "text-amber-500 dark:text-amber-400"
    return "text-red-500 dark:text-red-400"
  }

  return (
    <Card className="p-4 border-2 border-primary/10 bg-primary/5 rounded-xl overflow-hidden">
      <div className="space-y-4">
        {/* Header with verdict */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`px-3 py-1 ${getVerdictColor()}`}>
              {verdict}
            </Badge>
            <span className="text-xs text-muted-foreground">
              with <span className={`font-medium ${getConfidenceColor()}`}>{confidence}%</span> confidence
            </span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background">
              <Clock className="h-3 w-3 mr-1" />
              {report.timeframe}
            </Badge>
            <Badge variant="outline" className="bg-background">
              <BarChart3 className="h-3 w-3 mr-1" />
              {report.riskLevel} risk
            </Badge>
          </div>
        </div>

        {/* Goal Analysis */}
        <div>
          <button
            className="w-full flex items-center justify-between text-left text-sm font-medium mb-2"
            onClick={() => toggleSection("goal")}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Goal Analysis
            </div>
            {expandedSection === "goal" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSection === "goal" && (
            <div className="bg-background p-3 rounded-lg text-xs">
              <p>{goalAnalysis}</p>
            </div>
          )}
        </div>

        {/* Market Factors */}
        <div>
          <button
            className="w-full flex items-center justify-between text-left text-sm font-medium mb-2"
            onClick={() => toggleSection("market")}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Market Factors
            </div>
            {expandedSection === "market" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSection === "market" && (
            <div className="space-y-2">
              {marketFactors.map((factor, index) => (
                <div key={index} className="bg-background p-3 rounded-lg text-xs flex items-start gap-2">
                  {factor.trend === "up" ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-medium">{factor.name}</div>
                    <div className="text-muted-foreground">{factor.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tradeoffs */}
        <div>
          <button
            className="w-full flex items-center justify-between text-left text-sm font-medium mb-2"
            onClick={() => toggleSection("tradeoffs")}
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Key Tradeoffs
            </div>
            {expandedSection === "tradeoffs" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSection === "tradeoffs" && (
            <div className="bg-background p-3 rounded-lg text-xs">
              <ul className="space-y-2">
                {tradeoffs.map((tradeoff, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-medium min-w-[80px]">{tradeoff.type}:</span>
                    <span className="text-muted-foreground">{tradeoff.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommendation */}
        <div>
          <button
            className="w-full flex items-center justify-between text-left text-sm font-medium mb-2"
            onClick={() => toggleSection("recommendation")}
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recommendation
            </div>
            {expandedSection === "recommendation" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSection === "recommendation" && (
            <div className="bg-background p-3 rounded-lg text-xs">
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
