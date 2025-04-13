// backend/src/app.ts
import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"

import connectDB from "./config/db"

// ✨ ROUTERS
import userRoutes      from "./routes/userRoutes"
import interestRoutes  from "./routes/interestRoutes"   // <-- singular “interest”
import articleRoutes   from "./routes/articleRoutes"

import { getNews } from "./dataCollection/getNews"
import { getParsedOpenApiSummaryResponse } from "./ai/openAi"

dotenv.config()
console.log("MONGO_URI:", process.env.MONGO_URI)

// ────────────────────────────────────────────────────────────
// DB
// ────────────────────────────────────────────────────────────
connectDB()

// ────────────────────────────────────────────────────────────
// APP
// ────────────────────────────────────────────────────────────
const app  = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: ["http://localhost:3000"],        // TODO: add prod URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)
app.use(express.json())

// ────────────────────────────────────────────────────────────
// BASE
// ────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.send("DevFest Backend is running! :D")
})

// ────────────────────────────────────────────────────────────
// ROUTES (NOTE THE PATHS)
// ────────────────────────────────────────────────────────────
app.use("/users",     userRoutes)      // e.g. /users/register, /users/login
app.use("/users",     interestRoutes)  // e.g. /users/:userId/interests
app.use("/articles",  articleRoutes)   // e.g. /articles/…

// ────────────────────────────────────────────────────────────
// NEWS + OPEN‑AI DEMO ENDPOINTS
// ────────────────────────────────────────────────────────────
app.get("/api/news", async (req, res) => {
  const query    = req.query.query as string
  const location = (req.query.location as string) || "USA"

  try {
    const news = await getNews({ query, location })
    res.json(news)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

app.get("/query/:searchItem", async (req, res) => {
  const searchItem   = req.params.searchItem
  const newsResponse = await getNews({ query: searchItem, location: "USA" })

  // take top 5 links
  const links = newsResponse.news_results.slice(0, 5).map((n: any) => n.link)

  const openAiResponse = await getParsedOpenApiSummaryResponse({
    input: `
      Return a JSON exactly like:
      {
        "recommendation": "...",
        "reasoning": ["...", "..."],
        "articles": [{ "title": "...", "summary": "...", "key_points": ["..."] }]
      }
      using 20 words or fewer per summary/key‑point, based on these links:
      ${links.join("\n")}
    `,
    instructions: "You are a helpful consultant",
  })

  res.json(openAiResponse)
})

// ────────────────────────────────────────────────────────────
// START
// ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
