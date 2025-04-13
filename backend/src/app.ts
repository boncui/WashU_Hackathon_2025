//backend/src/app.ts
import express, { Request, Response } from 'express'; //express is used to create the server
import dotenv from 'dotenv'; //dotenv is used for managing enviorment variables
import userRoutes from './routes/userRoutes';
import interestsRoutes from './routes/interestsRoutes';
import connectDB from './config/db';
import mongoose from 'mongoose';
import cors from 'cors';
import {getNews} from './dataCollection/getNews';
import {getParsedOpenApiSummaryResponse} from './ai/openAi';


dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

//Database connection
connectDB();
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('MongoDB Connected'))
    .catch((err: unknown) => console.error('MongoDB connection error:', (err as Error).message));

const app = express();
const PORT = process.env.PORT || 5000; //PORT 5000 is being used by Mac

const corsOptions = {
    origin: ['http://localhost:3000',
    ], // REPLACE w Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, //for cookies and tokens
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

//Base route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('DevFest Backend is running! :D');
});

// Mount user routes
app.use('/users', userRoutes);
app.use('/interests', interestsRoutes);

app.get('/query/:searchItem', async (req: Request, res: Response) => {
    const searchItem = req.params.searchItem;
    const newsResponse = await getNews({query: searchItem, location: 'USA'});
    let newsLinks = [];
    const newsResults = newsResponse.news_results;
    let articleMap = new Map();

    for(let i = 0; i < 5; i++){
        articleMap.set(newsResults[i].link, newsResults[i]);
        newsLinks.push(newsResults[i].link);
    }

    console.log("news results", newsResults);
    const wordLimit = 20
    const instruction = 'You are a helpful consultant';
    let openAiResponse = await getParsedOpenApiSummaryResponse({
        input: `Return a structured JSON object EXACTLY in this format:
                    {
                      "recommendation": "A single string with your consolidated recommendation",
                      "reasoning": ["An array of strings with reasons for the recommendation"],
                      "articles": [
                        {
                        /*  "link": "provided link",*/
                          "title": "article title",
                          "summary": "Summary of article",
                          "key_points": ["Array of key points"]
                        }
                      ]
                    }
        based on the
        the following links, using ${wordLimit} words or less per summary and point:
        ${newsLinks.join('\n')}`,
        instructions: instruction
    });
    console.log(openAiResponse);


    res.send('Response received');
});


//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

