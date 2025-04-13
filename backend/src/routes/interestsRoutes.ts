// ✅ routes/interestRoutes.ts
import express, { Request, Response, Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware';
import InterestModel, { InterestType } from '../models/Interests';
import ArticleModel from '../models/Article';
import UserModel from '../models/User';

const router: Router = express.Router();

// ✅ Add a new interest to a user
router.post('/:userId/interests', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, type, update, articles } = req.body;

    if (!Object.values(InterestType).includes(type)) {
      return res.status(400).json({ error: 'Invalid interest type' });
    }

    const articleDocs = await ArticleModel.find({ _id: { $in: articles } });

 /*   if (articleDocs.length !== articles.length) {
      return res.status(400).json({ error: 'One or more articles not found' });
    }
*/
    const interest = await InterestModel.create({ name, type, update, articles });

    await UserModel.findByIdAndUpdate(req.params.userId, {
      $push: { interests: interest._id },
    });

    res.status(201).json(interest);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
  }
});

// ✅ Get all interests for a user
router.get('/:userId/interests', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate({
      path: 'interests',
      populate: { path: 'articles' },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.interests);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
  }
});


// ✅ Delete an interest from a user
router.delete('/:userId/interests/:interestId', authenticate, async (req: Request, res: Response) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.userId, {
      $pull: { interests: req.params.interestId },
    });

    await InterestModel.findByIdAndDelete(req.params.interestId);

    res.status(200).json({ message: 'Interest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' });
  }
});

export default router;
