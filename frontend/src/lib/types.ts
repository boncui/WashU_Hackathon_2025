export interface MarketFactor {
  name: string
  description: string
  trend: "up" | "down"
}

export interface Tradeoff {
  type: string
  description: string
}

export interface DecisionReportType {
  verdict: "Yes" | "No" | "Depends"
  confidence: number
  timeframe: string
  riskLevel: "Low" | "Medium" | "High"
  goalAnalysis: string
  marketFactors: MarketFactor[]
  tradeoffs: Tradeoff[]
  recommendation: string
}
