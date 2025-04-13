//userRoutes.ts
import express, { NextFunction, Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();


const router: Router = express.Router();


// add nodemail configuration
// this nodemail configuration is currenlty set up for outlook mail


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
        //console.log("validation errors", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ✅ Register a user
router.post('/register', validateCreateUser, handleValidationErrors, async (req: Request, res: Response) => {
    try {
        const { fullName, email, password }: { fullName: string; email: string; password: string } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        // Hash password & create user
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

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user: { _id: user._id, fullName: user.fullName, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});


// ✅ GET Authenticated User Data (`/me`)
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized: No user found' });

        // Fetch user without password
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching user data' });
    }
});

// ✅ GET User by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// ✅ GET All Users (with pagination)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find()
            .skip((+page - 1) * +limit)
            .limit(+limit);

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
router.post('/logout', authenticate, (req: Request, res: Response) => {
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
