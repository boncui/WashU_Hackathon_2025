// This file simulates fetching news data related to a decision
// In a production app, you would replace this with actual API calls to news services

interface NewsItem {
  title: string
  source: string
  date: string
  summary: string
}

// Simulated API call to fetch news data
export async function fetchNewsForQuery(decision: string, location = ""): Promise<string[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Extract keywords from the decision
  const keywords = extractKeywords(decision)

  // Get news based on decision type
  const decisionType = categorizeDecision(decision)

  // Get location-specific news if available
  const locationNews = location ? getLocationSpecificNews(location, decisionType) : []

  // Get general news for the decision type
  const generalNews = getNewsForDecisionType(decisionType, keywords)

  // Combine and return a subset of news items
  return [...locationNews, ...generalNews].slice(0, 5)
}

// Extract keywords from the decision text
function extractKeywords(decision: string): string[] {
  const words = decision.toLowerCase().split(/\s+/)
  return words.filter(
    (word) =>
      word.length > 3 &&
      ![
        "should",
        "would",
        "could",
        "about",
        "with",
        "that",
        "have",
        "this",
        "from",
        "they",
        "will",
        "what",
        "when",
        "make",
        "like",
        "time",
        "just",
        "know",
        "take",
        "into",
        "year",
        "your",
        "good",
      ].includes(word),
  )
}

// Categorize the decision into a type
function categorizeDecision(decision: string): string {
  const decisionLower = decision.toLowerCase()

  if (decisionLower.includes("buy") || decisionLower.includes("purchase") || decisionLower.includes("get")) {
    if (
      decisionLower.includes("house") ||
      decisionLower.includes("home") ||
      decisionLower.includes("apartment") ||
      decisionLower.includes("condo")
    ) {
      return "real_estate"
    }
    if (decisionLower.includes("car") || decisionLower.includes("vehicle") || decisionLower.includes("truck")) {
      return "automotive"
    }
  }

  if (
    decisionLower.includes("invest") ||
    decisionLower.includes("stock") ||
    decisionLower.includes("bond") ||
    decisionLower.includes("crypto") ||
    decisionLower.includes("bitcoin")
  ) {
    return "investment"
  }

  if (
    decisionLower.includes("job") ||
    decisionLower.includes("career") ||
    decisionLower.includes("work") ||
    decisionLower.includes("profession") ||
    decisionLower.includes("employment")
  ) {
    return "career"
  }

  if (decisionLower.includes("move") || decisionLower.includes("relocate") || decisionLower.includes("relocation")) {
    return "relocation"
  }

  if (
    decisionLower.includes("education") ||
    decisionLower.includes("school") ||
    decisionLower.includes("college") ||
    decisionLower.includes("degree") ||
    decisionLower.includes("university")
  ) {
    return "education"
  }

  return "general"
}

// Get location-specific news
function getLocationSpecificNews(location: string, decisionType: string): string[] {
  const locationLower = location.toLowerCase()

  // Real estate location news
  if (decisionType === "real_estate") {
    if (locationLower.includes("austin") || locationLower.includes("texas")) {
      return [
        "Austin's housing market shows signs of cooling with inventory up 15% compared to last year",
        "Texas property tax rates remain among the highest in the nation, offsetting the absence of state income tax",
        "New tech company expansions in Austin are expected to increase housing demand in specific neighborhoods",
      ]
    }
    if (locationLower.includes("new york") || locationLower.includes("nyc")) {
      return [
        "NYC rental prices have increased 12% year-over-year, reaching new record highs",
        "New York's co-op boards are becoming more selective with financial requirements for buyers",
        "Suburban areas around NYC are seeing increased demand as remote work policies become permanent",
      ]
    }
  }

  // Automotive location news
  if (decisionType === "automotive") {
    if (locationLower.includes("houston") || locationLower.includes("texas")) {
      return [
        "Houston dealerships report increased inventory levels, creating better negotiating conditions for buyers",
        "Texas auto insurance rates have risen 17% in the past year, among the highest increases nationally",
        "Houston's expanding public transit options may reduce the necessity of car ownership in certain neighborhoods",
      ]
    }
    if (locationLower.includes("california") || locationLower.includes("los angeles") || locationLower.includes("la")) {
      return [
        "California's new emissions standards will affect vehicle availability and pricing starting next quarter",
        "Los Angeles county has expanded EV charging infrastructure by 35% in the past year",
        "California offers up to $7,000 in state incentives for electric vehicle purchases, in addition to federal tax credits",
      ]
    }
  }

  // Career location news
  if (decisionType === "career") {
    if (locationLower.includes("remote") || locationLower.includes("work from home") || locationLower.includes("wfh")) {
      return [
        "Remote job postings have decreased by 18% compared to last year as more companies require office presence",
        "Companies offering fully-remote positions are reporting 27% higher application rates but can negotiate lower salaries",
        "New tax implications for remote workers crossing state lines are creating compliance challenges for employers",
      ]
    }
    if (locationLower.includes("seattle") || locationLower.includes("washington")) {
      return [
        "Seattle's tech sector is experiencing a 7% growth in new positions despite broader industry layoffs",
        "Washington state's lack of income tax remains attractive for high-earning professionals",
        "Seattle's cost of living has increased 5% year-over-year, partially offsetting higher tech salaries",
      ]
    }
  }

  // Investment location news
  if (decisionType === "investment") {
    // Investment news is generally not location-specific, but we can provide some regional economic news
    if (locationLower.includes("international") || locationLower.includes("global")) {
      return [
        "International markets are showing higher volatility due to ongoing trade tensions and currency fluctuations",
        "Emerging markets are projected to outperform developed markets in the coming fiscal year according to major analysts",
        "Global supply chain improvements have reduced inflationary pressures in manufacturing sectors",
      ]
    }
  }

  // Relocation news
  if (decisionType === "relocation") {
    if (locationLower.includes("austin") || locationLower.includes("texas")) {
      return [
        "Austin ranked #3 in U.S. cities for job growth, with technology and healthcare leading sectors",
        "Texas property taxes average 1.8% of home value, among the highest rates nationally",
        "Austin's cost of living has increased 9% year-over-year, faster than the national average",
      ]
    }
    if (locationLower.includes("denver") || locationLower.includes("colorado")) {
      return [
        "Denver's job market shows strong growth in technology and healthcare sectors with 5% year-over-year increase",
        "Colorado's housing costs have stabilized after rapid pandemic increases, with slight decreases in some areas",
        "Denver's expanding light rail system has improved commute times and reduced transportation costs for residents",
      ]
    }
  }

  // Return empty array if no location-specific news is found
  return []
}

// Get general news for the decision type
function getNewsForDecisionType(decisionType: string, keywords: string[]): string[] {
  switch (decisionType) {
    case "real_estate":
      return [
        "Mortgage rates have decreased by 0.25% in the past month, improving affordability metrics",
        "National housing inventory has increased 12% year-over-year, shifting toward a buyer's market in many regions",
        "New construction starts are down 8% compared to last year due to persistent labor shortages",
        "First-time homebuyer programs have expanded eligibility requirements in several states",
        "Real estate economists predict a 3-5% appreciation in home values over the next 12 months",
      ]

    case "automotive":
      return [
        "New vehicle prices have decreased 2.3% from their peak as inventory levels normalize",
        "Electric vehicle market share has reached 7.8% of new car sales, up from 5.6% last year",
        "Auto loan interest rates remain elevated at an average of 7.2% for new vehicles",
        "Used car prices have dropped 8.5% year-over-year as rental car companies reduce fleet sizes",
        "Fuel efficiency standards are set to increase by 10% next year, affecting new vehicle designs and pricing",
      ]

    case "investment":
      return [
        "The S&P 500 has returned 9.2% year-to-date, outperforming historical averages",
        "Bond yields have stabilized after recent Federal Reserve policy adjustments",
        "Market volatility indicators suggest increased uncertainty in the coming quarter",
        "Sector rotation is favoring technology and healthcare over consumer discretionary stocks",
        "Cryptocurrency market capitalization has increased 15% in the past month amid regulatory clarity",
      ]

    case "career":
      return [
        "Job openings have decreased 7% year-over-year across most sectors",
        "Remote work opportunities now represent 15% of all job postings, down from 18% last year",
        "Average salary increases are projected at 3.8% for the coming year, slightly above inflation",
        "Skills in artificial intelligence and data analysis command a 22% premium in the job market",
        "Employee turnover rates have normalized to pre-pandemic levels in most industries",
      ]

    case "relocation":
      return [
        "Interstate migration patterns show continued movement from high-cost coastal areas to the Southeast and Mountain West",
        "Remote work policies are becoming more restrictive, with 65% of companies now requiring some office presence",
        "Housing affordability index shows dramatic regional variations, with Midwest and South offering best value",
        "Quality of life rankings highlight mid-sized cities with strong economies and lower living costs",
        "Climate change considerations are increasingly factoring into relocation decisions according to recent surveys",
      ]

    case "education":
      return [
        "Return on investment for four-year degrees varies dramatically by field of study and institution",
        "Online degree programs have gained increased acceptance among employers, with 78% viewing them as equivalent to in-person degrees",
        "Student loan repayment terms have been modified with new income-driven options",
        "Skills-based certificates show strong employment outcomes in technology and healthcare fields",
        "Employer tuition assistance programs have expanded, with 35% of large companies offering education benefits",
      ]

    default:
      return [
        "Consumer confidence index has increased 3.2 points in the past month",
        "Inflation has moderated to 3.1% annually, down from 3.7% earlier this year",
        "Economic growth projections remain positive at 2.3% for the coming year",
        "Interest rates are expected to decrease slightly in the next two quarters",
        "Consumer spending patterns show resilience despite economic uncertainties",
      ]
  }
}
