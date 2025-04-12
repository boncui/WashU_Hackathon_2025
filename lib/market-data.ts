// This file simulates fetching real market data
// In a production app, you would replace this with actual API calls

interface MarketDataPoint {
  name: string
  value: string
  trend: "up" | "down" | "stable"
}

// Simulated API call to fetch market data
export async function fetchMarketData(domain: string): Promise<MarketDataPoint[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return domain-specific data
  switch (domain.toLowerCase()) {
    case "finance":
    case "investment":
      return [
        { name: "S&P 500", value: "5,123.41", trend: "up" },
        { name: "Interest Rate", value: "5.25%", trend: "up" },
        { name: "Inflation Rate", value: "3.4%", trend: "down" },
        { name: "Consumer Confidence", value: "106.7", trend: "up" },
      ]

    case "real estate":
    case "housing":
      return [
        { name: "Median Home Price", value: "$428,700", trend: "up" },
        { name: "Mortgage Rate (30yr)", value: "6.84%", trend: "up" },
        { name: "Housing Inventory", value: "1.2M units", trend: "up" },
        { name: "Rental Vacancy Rate", value: "6.6%", trend: "down" },
      ]

    case "career":
    case "job":
    case "employment":
      return [
        { name: "Unemployment Rate", value: "3.8%", trend: "down" },
        { name: "Job Openings", value: "8.7M", trend: "down" },
        { name: "Average Wage Growth", value: "4.2%", trend: "up" },
        { name: "Remote Job Listings", value: "14% of total", trend: "down" },
      ]

    case "automotive":
    case "car":
    case "vehicle":
      return [
        { name: "New Car Prices", value: "$48,275 avg", trend: "up" },
        { name: "Used Car Prices", value: "$26,720 avg", trend: "down" },
        { name: "Auto Loan Rate", value: "7.4%", trend: "up" },
        { name: "Fuel Prices", value: "$3.52/gallon", trend: "up" },
      ]

    default:
      // Generic economic indicators for other domains
      return [
        { name: "Inflation Rate", value: "3.4%", trend: "down" },
        { name: "GDP Growth", value: "2.1%", trend: "up" },
        { name: "Consumer Spending", value: "+0.7% MoM", trend: "up" },
        { name: "Consumer Confidence", value: "106.7", trend: "up" },
      ]
  }
}

// In a real implementation, you might use APIs like:
// - Financial data: Alpha Vantage, Yahoo Finance API
// - Real estate: Zillow API, Redfin API
// - Job market: Bureau of Labor Statistics API, Indeed API
// - News and sentiment: NewsAPI, GDELT
