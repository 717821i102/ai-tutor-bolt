import { Router } from 'express';
import tutorRoutes from './tutor.routes';
import userRoutes from './user.routes';
import { askQuestion } from '../controllers/tutor.controller';
import { getUserProfile } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import lessonsRoutes from './lessons';
import qaRoutes from './qa';
import usersRoutes from './users';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API v1 routes
const v1Router = Router();
router.use('/v1', v1Router);

// Mount v1 routes
v1Router.use('/lessons', lessonsRoutes);
v1Router.use('/qa', qaRoutes);
v1Router.use('/users', usersRoutes);

// Legacy API routes with controllers
router.use('/tutor', tutorRoutes);
router.use('/users', userRoutes);

// Direct controller routes
router.post('/ask', authenticate, askQuestion);
router.get('/profile', authenticate, getUserProfile);

export default router;
