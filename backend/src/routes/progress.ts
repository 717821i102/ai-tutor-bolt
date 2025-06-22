import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { ProgressService } from '../services/progressService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user's progress for all lessons
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const progress = await ProgressService.getUserProgress(req.user.uid);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get progress for specific lesson
router.get('/lesson/:lessonId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { lessonId } = req.params;
    const progress = await ProgressService.getLessonProgress(req.user.uid, lessonId);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update lesson progress
router.put('/lesson/:lessonId', [
  authenticateToken,
  body('progress').optional().isFloat({ min: 0, max: 1 }),
  body('timeSpent').optional().isInt({ min: 0 }),
  body('lastPosition').optional().trim(),
  body('completed').optional().isBoolean()
], async (req: AuthenticatedRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { lessonId } = req.params;
    const updates = req.body;

    const progress = await ProgressService.updateProgress(req.user.uid, lessonId, updates);

    res.json({
      success: true,
      data: progress,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Submit exercise result
router.post('/lesson/:lessonId/exercise', [
  authenticateToken,
  body('exerciseId').trim().notEmpty(),
  body('answer').trim().notEmpty(),
  body('isCorrect').isBoolean(),
  body('timeSpent').isInt({ min: 0 }),
  body('attempts').optional().isInt({ min: 1 })
], async (req: AuthenticatedRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { lessonId } = req.params;
    const exerciseResult = {
      ...req.body,
      attempts: req.body.attempts || 1
    };

    const progress = await ProgressService.submitExerciseResult(
      req.user.uid,
      lessonId,
      exerciseResult
    );

    res.json({
      success: true,
      data: progress,
      message: 'Exercise result submitted successfully'
    });
  } catch (error) {
    console.error('Submit exercise result error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const stats = await ProgressService.getUserStats(req.user.uid);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;