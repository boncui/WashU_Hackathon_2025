import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import mongoose from "mongoose";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

// Define type of decoded token for req.user
interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser; 
}

// Authentication Middleware
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const secret: Secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret) as DecodedToken;

        // Fetch user details **including role**
        const user = await User.findById(decoded.id).select("_id fullName email");

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        req.user = user.toObject(); // ✅ Convert to plain JavaScript object

        // console.log("Authenticated User:", req.user); // FOR DEBUGGING

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};



