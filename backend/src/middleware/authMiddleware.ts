// backend/src/authMiddleware
import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import mongoose from 'mongoose'
import User, { IUser } from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

// Define the structure of the JWT payload
interface DecodedToken {
  id: string
  iat: number
  exp: number
}

// Extend Express's Request object to include `user`
export interface AuthenticatedRequest extends Request {
  user?: IUser
}

// ✅ Authentication Middleware
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    const secret: Secret = process.env.JWT_SECRET!
    const decoded = jwt.verify(token, secret) as DecodedToken

    const user = await User.findById(decoded.id).select('_id fullName email interests') // ✅ include interests

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    req.user = user.toObject() // Convert to plain JS object

    next()
  } catch (error) {
    console.error('🔐 Authentication Error:', error)
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}
