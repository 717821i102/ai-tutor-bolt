import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    let user = await UserService.getUserById(req.user.uid);
    
    if (!user) {
      // Create user if doesn't exist
      user = await UserService.createUser({
        uid: req.user.uid,
        email: req.user.email!,
        displayName: req.user.name || req.user.email!.split('@')[0]
      });
    } else {
      // Update last login
      user = await UserService.updateUser(req.user.uid, { lastLogin: new Date() });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/me', [
  authenticateToken,
  body('displayName').optional().trim().isLength({ min: 2 }),
  body('preferences').optional().isObject()
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

    const { displayName, preferences } = req.body;
    const updates: any = {};

    if (displayName) updates.displayName = displayName;
    if (preferences) updates.preferences = preferences;

    const user = await UserService.updateUser(req.user.uid, updates);

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/me/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const stats = await UserService.getUserStats(req.user.uid);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;