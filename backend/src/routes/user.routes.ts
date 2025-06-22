import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUserProfile } from '../controllers/user.controller';

const router = Router();

// Use the controller instead of inline handler
router.get('/profile', authenticate, getUserProfile);

export default router;
