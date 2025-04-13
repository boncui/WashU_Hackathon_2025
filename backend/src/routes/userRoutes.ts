// ✅ routes/userRoutes.ts
import express, { NextFunction, Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Interests from '../models/Interests';
import Article from '../models/Article';
import dotenv from 'dotenv';
dotenv.config();

const router: Router = express.Router();

// 🔹 Validation Middleware for creating users
const validateCreateUser = [
    check('fullName')
        .notEmpty().withMessage('Full Name is required.')
        .isLength({ min: 2 }).withMessage('Full Name must be at least 2 characters long.'),
    check('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character.'),
];

// 🔹 Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ✅ Register a user
router.post('/register', validateCreateUser, handleValidationErrors, async (req: Request, res: Response) => {
    try {
        const { fullName, email, password }: { fullName: string; email: string; password: string } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ LOGIN Functionality
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                interests: user.interests || [],
            },
        });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ GET Authenticated User Data
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        console.warn("No user attached to request")
        return res.status(401).json({ error: 'Unauthorized: No user found' });
      }
  
      console.log("🪪 Authenticated user id:", req.user._id)
  
      const user = await User.findById(req.user._id)
        .select('-password')
        .populate({
            path: 'interests',
            populate: {
            path: 'articles',
            match: {}, // ✅ prevents crashes from null or broken references
            },
        })
        .lean(); // ✅ also prevents Mongoose serialization bugs

  
      if (!user) {
        console.warn("User document not found in DB")
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("🔥 /me route error:", error)
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error fetching user data' });
    }
  });
  
  

// ✅ GET User by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('interests');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ GET All Users (paginated)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find()
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ UPDATE User
router.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const { fullName, email }: { fullName?: string; email?: string } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ LOGOUT Functionality
router.post('/logout', authenticate, (_req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ DELETE User
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User successfully deleted!' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

export default router;
