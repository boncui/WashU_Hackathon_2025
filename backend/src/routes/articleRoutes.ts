// ✅ routes/articleRoutes.ts
import express, { Request, Response } from 'express'
import Article, { IArticle } from '../models/Article'
import Interest from '../models/Interests' // ✅ singular, not Interests
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware'

const router = express.Router()

// ✅ Create and link article to an interest
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, summary, link, tags, image, interestId } = req.body

    // Create article
    const newArticle: IArticle = new Article({ name, summary, link, tags, image })
    const savedArticle = await newArticle.save()

    // Link to interest
    const interest = await Interest.findById(interestId)
    if (!interest) {
      return res.status(404).json({ error: 'Interest not found' })
    }

    if (interest.articles.length >= 5) {
      return res.status(400).json({ error: 'Cannot link more than 5 articles to an interest' })
    }

    interest.articles.push(savedArticle._id)
    await interest.save()

    res.status(201).json(savedArticle)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' })
  }
})

// ✅ Get all articles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const articles = await Article.find()
    res.status(200).json(articles)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching articles' })
  }
})

// ✅ Get article by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ error: 'Article not found' })
    res.status(200).json(article)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching article' })
  }
})

// ✅ Delete article by ID
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) return res.status(404).json({ error: 'Article not found' })

    // Remove reference from interests
    await Interest.updateMany(
      { articles: article._id },
      { $pull: { articles: article._id } }
    )

    res.status(200).json({ message: 'Article deleted and unlinked from interests' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting article' })
  }
})

// ✅ Get all interests populated with articles
router.get('/interests/full', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const interests = await Interest.find({ user: req.user?._id }).populate('articles')
    res.status(200).json(interests)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching interests with articles' })
  }
})

export default router
