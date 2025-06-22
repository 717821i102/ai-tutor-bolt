import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { askQuestion } from '../controllers/tutor.controller';

const router = Router();

// Use the controller instead of inline handler
router.post('/ask', authenticate, askQuestion);

export default router;
