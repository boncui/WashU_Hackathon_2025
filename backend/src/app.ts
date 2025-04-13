import express, { Request, Response } from 'express'; //express is used to create the server
import dotenv from 'dotenv'; //dotenv is used for managing enviorment variables
import userRoutes from './routes/userRoutes';
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

app.get('/query/:searchItem', async (req: Request, res: Response) => {
    const searchItem = req.params.searchItem;
    const newsResponse = await getNews({query: searchItem, location: 'USA'});
    let newsLinks = [];
    const newsResults = newsResponse.news_results;
    for(let i = 0; i < 5; i++){
        newsLinks.push(newsResults[i].link);
    }
    const wordLimit = 20
    const instruction = 'You are a helpful financial analyst';
    let openAiResponses = await newsLinks.reduce(async (previousPromise, link) => {
        const accumulator = await previousPromise;
        const openAiPrompt = `Return only a structured JSON with summary, key points (as keyPoints) in ${wordLimit} words or less per summary and point: ${link}`;
        const openAiResponse = await getParsedOpenApiSummaryResponse({input: openAiPrompt, instructions: instruction});
        if(openAiResponse){
            accumulator.push(openAiResponse);
        }
        return accumulator;
    }, Promise.resolve([]));
    console.log("Structured responses", openAiResponses)
    res.send('Response received');
});


//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

