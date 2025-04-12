import express, { Request, Response } from 'express'; //express is used to create the server
import dotenv from 'dotenv'; //dotenv is used for managing enviorment variables
import userRoutes from './routes/userRoutes';
import connectDB from './config/db';
import mongoose from 'mongoose';
import cors from 'cors';


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


//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

