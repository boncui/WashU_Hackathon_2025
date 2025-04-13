import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import type { DecisionReportType } from "../types/types"
import { fetchMarketData } from "./market-data"

// Define the schema for the decision report
const marketFactorSchema = z.object({
  name: z.string(),
  description: z.string(),
  trend: z.enum(["up", "down"]),
})

const tradeoffSchema = z.object({
  type: z.string(),
  description: z.string(),
})

const decisionReportSchema = z.object({
  verdict: z.enum(["Yes", "No", "Depends"]),
  confidence: z.number().min(0).max(100),
  timeframe: z.string(),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  goalAnalysis: z.string(),
  marketFactors: z.array(marketFactorSchema).min(2).max(4),
  tradeoffs: z.array(tradeoffSchema).min(2).max(4),
  recommendation: z.string(),
})

/**
 * Process a decision query through the multi-agent system
 */
export async function processDecisionQuery(query: string): Promise<DecisionReportType> {
  const model = openai("gpt-4o")

  // Step 1: Extract intent and goals from the query
  const { object: queryAnalysis } = await generateObject({
    model,
    schema: z.object({
      intent: z.string(),
      domain: z.string(),
      timeframe: z.string(),
      impliedGoals: z.array(z.string()).min(2).max(5),
      riskLevel: z.enum(["Low", "Medium", "High"]),
    }),
    prompt: `
      Analyze this decision query: "${query}"
      
      Extract the user's intent, the domain (e.g., finance, career, housing), implied timeframe, 
      and the implied goals behind this question. Also assess the risk level involved.
      
      Be specific and realistic in your analysis.
      Also assess the risk level involved.
      
      Be specific and realistic in your analysis.
    `,
  })

  // Step 2: Fetch real-time market data based on the domain
  const marketData = await fetchMarketData(queryAnalysis.domain)

  // Step 3: Generate market factors based on the domain and real data
  const { object: marketAnalysis } = await generateObject({
    model,
    schema: z.object({
      marketFactors: z.array(marketFactorSchema).min(2).max(4),
    }),
    prompt: `
      Based on this decision query: "${query}"
      
      And this analysis:
      - Intent: ${queryAnalysis.intent}
      - Domain: ${queryAnalysis.domain}
      - Timeframe: ${queryAnalysis.timeframe}
      - Implied Goals: ${queryAnalysis.impliedGoals.join(", ")}
      
      And these real-time market data points:
      ${marketData.map((item) => `- ${item.name}: ${item.value} (${item.trend})`).join("\n")}
      
      Generate 2-4 relevant market factors that would influence this decision.
      Each factor should have:
      - A specific name
      - A brief description of how it impacts the decision
      - A trend direction (up or down)
      
      Use the real market data provided above in your response. Be specific and factual.
    `,
  })

  // Step 4: Generate tradeoffs for the decision
  const { object: tradeoffAnalysis } = await generateObject({
    model,
    schema: z.object({
      tradeoffs: z.array(tradeoffSchema).min(2).max(4),
    }),
    prompt: `
      For this decision query: "${query}"
      
      With these goals: ${queryAnalysis.impliedGoals.join(", ")}
      And these market factors:
      ${marketAnalysis.marketFactors.map((f) => `- ${f.name}: ${f.description} (${f.trend})`).join("\n")}
      
      Generate 2-4 key tradeoffs the user should consider.
      Each tradeoff should have:
      - A type (e.g., "Time vs. Money", "Risk vs. Reward")
      - A description that explains the specific tradeoff in this context
      
      Be specific and practical in your analysis.
    `,
  })

  // Step 5: Make a final recommendation
  const { object: finalReport } = await generateObject({
    model,
    schema: decisionReportSchema,
    prompt: `
      You are ShouldIQ, a decision-making assistant that helps users make complex life decisions.
      
      Based on this decision query: "${query}"
      
      And this analysis:
      - Intent: ${queryAnalysis.intent}
      - Domain: ${queryAnalysis.domain}
      - Timeframe: ${queryAnalysis.timeframe}
      - Implied Goals: ${queryAnalysis.impliedGoals.join(", ")}
      - Risk Level: ${queryAnalysis.riskLevel}
      
      Market Factors:
      ${marketAnalysis.marketFactors.map((f) => `- ${f.name}: ${f.description} (${f.trend})`).join("\n")}
      
      Tradeoffs:
      ${tradeoffAnalysis.tradeoffs.map((t) => `- ${t.type}: ${t.description}`).join("\n")}
      
      Generate a complete decision report with:
      1. A clear verdict (Yes, No, or Depends)
      2. A confidence level (0-100%)
      3. The timeframe for this decision
      4. The risk level
      5. A goal analysis paragraph
      6. The market factors (use the ones provided)
      7. The tradeoffs (use the ones provided)
      8. A final recommendation paragraph
      
      Make your recommendation evidence-based, balanced, and actionable.
    `,
  })

  return finalReport
}

/**
 * Process a structured decision query with explicit variables
 */
export async function processStructuredQuery({
  decision,
  location,
  timeframe,
  goal,
  newsContext = [],
}: {
  decision: string
  location?: string
  timeframe?: string
  goal?: string
  newsContext?: string[]
}): Promise<DecisionReportType> {
  const model = openai("gpt-4o")

  // Construct the full query for analysis
  const fullQuery = `Should I ${decision}${location ? ` in ${location}` : ""}${
    timeframe ? ` in the ${timeframe}` : ""
  }${goal ? ` to ${goal}` : ""}?`

  // Step 1: Extract domain and risk level
  const { object: queryAnalysis } = await generateObject({
    model,
    schema: z.object({
      domain: z.string(),
      riskLevel: z.enum(["Low", "Medium", "High"]),
      impliedGoals: z.array(z.string()).min(2).max(5),
    }),
    prompt: `
      Analyze this structured decision query:
      - Decision: ${decision}
      - Location: ${location || "Not specified"}
      - Timeframe: ${timeframe || "Not specified"}
      - Goal: ${goal || "Not specified"}
      
      Extract the domain (e.g., finance, career, housing) and assess the risk level involved.
      Also identify 2-5 implied goals based on the user's stated goal and the nature of the decision.
      
      Be specific and realistic in your analysis.
    `,
  })

  // Step 2: Fetch real-time market data based on the domain
  const marketData = await fetchMarketData(queryAnalysis.domain)

  // Step 3: Generate market factors based on the domain, real data, and news context
  const { object: marketAnalysis } = await generateObject({
    model,
    schema: z.object({
      marketFactors: z.array(marketFactorSchema).min(2).max(4),
    }),
    prompt: `
      Based on this structured decision query:
      - Decision: ${decision}
      - Location: ${location || "Not specified"}
      - Timeframe: ${timeframe || "Not specified"}
      - Goal: ${goal || "Not specified"}
      
      And this analysis:
      - Domain: ${queryAnalysis.domain}
      - Risk Level: ${queryAnalysis.riskLevel}
      - Implied Goals: ${queryAnalysis.impliedGoals.join(", ")}
      
      And these real-time market data points:
      ${marketData.map((item) => `- ${item.name}: ${item.value} (${item.trend})`).join("\n")}
      
      And these relevant news items:
      ${newsContext.map((news) => `- ${news}`).join("\n")}
      
      Generate 2-4 relevant market factors that would influence this decision.
      Each factor should have:
      - A specific name
      - A brief description of how it impacts the decision
      - A trend direction (up or down)
      
      Use the real market data and news provided above in your response. Be specific and factual.
      If location is specified, include at least one location-specific factor.
    `,
  })

  // Step 4: Generate tradeoffs for the decision
  const { object: tradeoffAnalysis } = await generateObject({
    model,
    schema: z.object({
      tradeoffs: z.array(tradeoffSchema).min(2).max(4),
    }),
    prompt: `
      For this structured decision query:
      - Decision: ${decision}
      - Location: ${location || "Not specified"}
      - Timeframe: ${timeframe || "Not specified"}
      - Goal: ${goal || "Not specified"}
      
      With these goals: ${queryAnalysis.impliedGoals.join(", ")}
      And these market factors:
      ${marketAnalysis.marketFactors.map((f) => `- ${f.name}: ${f.description} (${f.trend})`).join("\n")}
      
      Generate 2-4 key tradeoffs the user should consider.
      Each tradeoff should have:
      - A type (e.g., "Time vs. Money", "Risk vs. Reward")
      - A description that explains the specific tradeoff in this context
      
      Be specific and practical in your analysis.
      If location is specified, include at least one location-specific tradeoff.
    `,
  })

  // Step 5: Make a final recommendation
  const { object: finalReport } = await generateObject({
    model,
    schema: decisionReportSchema,
    prompt: `
      You are ShouldIQ, a decision-making assistant that helps users make complex life decisions.
      
      Based on this structured decision query:
      - Decision: ${decision}
      - Location: ${location || "Not specified"}
      - Timeframe: ${timeframe || "Not specified"}
      - Goal: ${goal || "Not specified"}
      
      And this analysis:
      - Domain: ${queryAnalysis.domain}
      - Risk Level: ${queryAnalysis.riskLevel}
      - Implied Goals: ${queryAnalysis.impliedGoals.join(", ")}
      
      Market Factors:
      ${marketAnalysis.marketFactors.map((f) => `- ${f.name}: ${f.description} (${f.trend})`).join("\n")}
      
      Tradeoffs:
      ${tradeoffAnalysis.tradeoffs.map((t) => `- ${t.type}: ${t.description}`).join("\n")}
      
      And considering these relevant news items:
      ${newsContext.map((news) => `- ${news}`).join("\n")}
      
      Generate a complete decision report with:
      1. A clear verdict (Yes, No, or Depends)
      2. A confidence level (0-100%)
      3. The timeframe for this decision (use the user's specified timeframe if provided)
      4. The risk level
      5. A goal analysis paragraph that addresses the user's specific goal
      6. The market factors (use the ones provided)
      7. The tradeoffs (use the ones provided)
      8. A final recommendation paragraph that is specific to the location if provided
      
      Make your recommendation evidence-based, balanced, and actionable.
    `,
  })

  return finalReport
}
