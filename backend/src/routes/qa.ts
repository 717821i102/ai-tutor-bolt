import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { QAService } from '../services/qaService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user's QA sessions
router.get('/sessions', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const sessions = await QAService.getUserSessions(req.user.uid);

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get QA sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new QA session
router.post('/sessions', [
  authenticateToken,
  body('title').trim().notEmpty(),
  body('topic').optional().trim(),
  body('lessonId').optional().trim()
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

    const { title, topic, lessonId } = req.body;
    const session = await QAService.createSession(req.user.uid, title, topic, lessonId);

    res.status(201).json({
      success: true,
      data: session,
      message: 'QA session created successfully'
    });
  } catch (error) {
    console.error('Create QA session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get specific QA session
router.get('/sessions/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const session = await QAService.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (session.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get QA session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Ask question in session
router.post('/sessions/:id/ask', [
  authenticateToken,
  body('question').trim().notEmpty()
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

    const { id } = req.params;
    const { question } = req.body;

    const message = await QAService.askQuestion(id, question, req.user.uid);

    res.json({
      success: true,
      data: message,
      message: 'Question answered successfully'
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Update session title
router.put('/sessions/:id', [
  authenticateToken,
  body('title').trim().notEmpty()
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

    const { id } = req.params;
    const { title } = req.body;

    await QAService.updateSessionTitle(id, title, req.user.uid);

    res.json({
      success: true,
      message: 'Session title updated successfully'
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Delete QA session
router.delete('/sessions/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    await QAService.deleteSession(id, req.user.uid);

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

export default router;