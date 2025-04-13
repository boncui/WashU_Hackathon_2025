// scripts/checkInterestsForArticles.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import InterestModel, { InterestType } from '../models/Interests';
import ArticleModel from '../models/Article';

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', (error as Error).message);
    process.exit(1);
  }
}

async function checkAndProcessInterests() {
  try {
    await connectDB();

    // Find interests without articles or with fewer than 5 articles
    const interestsToProcess = await InterestModel.aggregate([
      {
        $match: {
          $or: [
            { articles: { $exists: false } },
            { articles: { $size: 0 } },
            { $expr: { $lt: [{ $size: "$articles" }, 5] } }
          ]
        }
      }
    ]);

    console.log(`Found ${interestsToProcess.length} interests to process`);

    if (interestsToProcess.length === 0) {
      console.log('No interests need processing at this time');
      return;
    }

    // Process each interest that needs articles
    for (const interest of interestsToProcess) {
      console.log(`Processing interest: ${interest.name} (${interest.type})`);

      try {
        // Use your existing endpoint to get recommendations and news data
        const response = await axios.get(`http://localhost:${process.env.PORT || 5000}/query/${encodeURIComponent(interest.name)}`);

        // Extract the processed response with AI summary
        const openAiResponse = response.data;

        if (!openAiResponse || !openAiResponse.articles) {
          console.log(`No articles found for interest: ${interest.name}`);
          continue;
        }

        // Get news articles
        const newsResponse = await axios.get(`http://localhost:${process.env.PORT || 5000}/api/news?query=${encodeURIComponent(interest.name)}`);
        const newsResults = newsResponse.data.news_results || [];

        // Map the articles with their metadata
        const articlesToCreate = [];

        // Calculate how many articles we need to add to reach 5
        const currentArticleCount = interest.articles ? interest.articles.length : 0;
        const neededArticleCount = Math.min(5 - currentArticleCount, openAiResponse.articles.length, newsResults.length);

        for (let i = 0; i < neededArticleCount; i++) {
          const processedArticle = openAiResponse.articles[i];
          const newsArticle = newsResults[i];

          if (!processedArticle || !newsArticle) continue;

          articlesToCreate.push({
            name: processedArticle.title || newsArticle.title,
            summary: processedArticle.summary,
            link: newsArticle.link,
            tags: [interest.name, interest.type],
            image: newsArticle.thumbnail || '',
          });
        }

        // Create articles in the database
        if (articlesToCreate.length > 0) {
          const createdArticles = await ArticleModel.create(articlesToCreate);
          console.log(`Created ${createdArticles.length} articles for interest: ${interest.name}`);

          // Link articles to the interest
          const interestDoc = await InterestModel.findById(interest._id);
          if (interestDoc) {
            const existingArticles = interestDoc.articles || [];
            const newArticleIds = createdArticles.map(article => article._id);
            interestDoc.articles = [...existingArticles, ...newArticleIds];
            await interestDoc.save();
            console.log(`Linked ${newArticleIds.length} new articles to interest: ${interest.name}`);
          }
        }
      } catch (error) {
        console.error(`Error processing interest ${interest.name}:`, (error as Error).message);
      }

      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Scheduled article check complete!');
  } catch (error) {
    console.error('Error in checkAndProcessInterests:', (error as Error).message);
  } finally {
    mongoose.disconnect();
  }
}

// If running directly (for testing)
if (require.main === module) {
  checkAndProcessInterests()
    .then(() => console.log('Script completed'))
    .catch(err => console.error('Script failed:', err));
}

// Export for use in scheduler
export default checkAndProcessInterests;