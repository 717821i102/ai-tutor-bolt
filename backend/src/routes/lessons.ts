import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { LessonService } from '../services/lessonService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get all lessons with filters
router.get('/', [
  query('subject').optional().trim(),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('search').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { subject, difficulty, search, limit, offset } = req.query;

    const lessons = await LessonService.getLessons({
      subject: subject as string,
      difficulty: difficulty as string,
      search: search as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });

    res.json({
      success: true,
      data: {
        lessons,
        total: lessons.length
      }
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await LessonService.getLessonById(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Generate lesson with AI
router.post('/generate', [
  authenticateToken,
  body('subject').trim().notEmpty(),
  body('topic').trim().notEmpty(),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
  body('durationMinutes').isInt({ min: 5, max: 180 }),
  body('learningObjectives').optional().isArray(),
  body('includeExercises').optional().isBoolean()
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

    const lesson = await LessonService.generateLessonWithAI(req.body, req.user.uid);

    res.json({
      success: true,
      data: lesson,
      message: 'Lesson generated successfully'
    });
  } catch (error) {
    console.error('Generate lesson error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate lesson'
    });
  }
});

// Create manual lesson
router.post('/', [
  authenticateToken,
  body('title').trim().notEmpty(),
  body('subject').trim().notEmpty(),
  body('topic').trim().notEmpty(),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
  body('durationMinutes').isInt({ min: 5, max: 180 }),
  body('summary').trim().notEmpty(),
  body('content').isArray(),
  body('exercises').optional().isArray(),
  body('tags').optional().isArray()
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

    const lesson = await LessonService.createLesson(req.body, req.user.uid);

    res.status(201).json({
      success: true,
      data: lesson,
      message: 'Lesson created successfully'
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user's lessons
router.get('/user/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const lessons = await LessonService.getUserLessons(req.user.uid);

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Get user lessons error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete lesson
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    await LessonService.deleteLesson(id, req.user.uid);

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Get available subjects
router.get('/meta/subjects', async (req, res) => {
  try {
    const subjects = await LessonService.getSubjects();

    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;