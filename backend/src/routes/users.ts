import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { userService } from '../services/userService';
import { AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get current user profile
router.get('/me', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await userService.getUserById(req.user!.uid);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.json({
    success: true,
    data: user,
  });
}));

// Update user profile
router.put('/me',
  body('displayName').optional().isLength({ min: 2 }).withMessage('Display name must be at least 2 characters'),
  body('photoURL').optional().isURL().withMessage('Photo URL must be valid'),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { displayName, photoURL } = req.body;
    
    const updatedUser = await userService.updateUser(req.user!.uid, {
      displayName,
      photoURL,
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  })
);

// Get user progress
router.get('/me/progress', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const progress = await userService.getUserProgress(req.user!.uid);
  
  res.json({
    success: true,
    data: progress,
  });
}));

// Update user preferences
router.put('/me/preferences',
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced', 'adaptive']),
  body('subjects').optional().isArray(),
  body('learningStyle').optional().isIn(['visual', 'auditory', 'kinesthetic', 'reading']),
  body('dailyGoal').optional().isInt({ min: 1, max: 10 }),
  body('weeklyGoal').optional().isInt({ min: 1, max: 50 }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const updatedUser = await userService.updateUserPreferences(req.user!.uid, req.body);

    res.json({
      success: true,
      data: updatedUser,
    });
  })
);

// Update lesson progress
router.post('/me/lessons/:lessonId/progress',
  body('progress').isFloat({ min: 0, max: 1 }).withMessage('Progress must be between 0 and 1'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a positive integer'),
  body('completed').optional().isBoolean(),
  body('score').optional().isFloat({ min: 0, max: 100 }),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { lessonId } = req.params;
    const progressData = req.body;

    const updatedProgress = await userService.updateLessonProgress(
      req.user!.uid,
      lessonId,
      progressData
    );

    res.json({
      success: true,
      data: updatedProgress,
    });
  })
);

export default router;