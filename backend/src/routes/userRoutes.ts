import express, { NextFunction, Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const router: Router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // define a new OAuth2Client

// add nodemail configuration
// this nodemail configuration is currenlty set up for outlook mail

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
        const user = new User({ fullName, email, password: hashedPassword, role: 'User' });
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

        // Generate JWT token (Includes role)
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// Reset User Password
// TODO: Verify user before resetting
router.post('/reset', async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log(email);
    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        console.log("user is found: ", user);

        console.log("env sender email is: ", process.env.EMAIL_USER);
        console.log("env sender password is: ", process.env.EMAIL_PASS);

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        // send email with reset link
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/${token}`;
        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
        });

        res.status(200).json({ message: "If an account exists, a reset email has been sent." });

    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
});

// reset password workflow after the user clicks the link in the email
router.post('/reset/:token', async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }, // Ensure token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.password = newPasswordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to reset user password' });
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

// google login functionality
router.post('/googlelogin', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        // verify google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ error: 'Google authentication failed' });

        const { email, name, sub } = payload;

        // check user existence
        let user = await User.findOne({ email });

        if (!user) {
            // create username if not exists 
            const hashedPassword = await bcrypt.hash(sub, 10); // hash google id as a password placeholder
            user = new User({
                fullName: name,
                email,
                password: hashedPassword,
                role: 'User',
            });

            await user.save();
        }

        // generate token
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(200).json({ token: jwtToken, user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Google login failed' });
    }
});


//Fetch top 20 songs for user
router.get('/:id/spotify-songs', authenticate, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('spotifySongs');
        if (!user) return res.status(404).json({ error: 'User not found' });
        

        res.status(200).json(user.spotifySongs);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Server error fetching songs' });
    }
});

//Update user's top 20 songs
router.post('/:id/spotify-songs', authenticate, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { songs } = req.body; // Expecting array of ISpotifySong

        // Basic validation
        if (!Array.isArray(songs) || songs.length === 0) {
            return res.status(400).json({ error: 'Invalid songs data' });
        }

        // Optionally trim to top 20
        user.spotifySongs = songs.slice(0, 20);
        user.spotifyConnected = true;
        await user.save();

        res.status(200).json({ message: 'Spotify songs updated successfully', spotifySongs: user.spotifySongs });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to update Spotify songs' });
    }
});



export default router;
