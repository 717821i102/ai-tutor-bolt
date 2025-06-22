"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const progressService_1 = require("../services/progressService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get user's progress for all lessons
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const progress = await progressService_1.ProgressService.getUserProgress(req.user.uid);
        res.json({
            success: true,
            data: progress
        });
    }
    catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Get progress for specific lesson
router.get('/lesson/:lessonId', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const { lessonId } = req.params;
        const progress = await progressService_1.ProgressService.getLessonProgress(req.user.uid, lessonId);
        res.json({
            success: true,
            data: progress
        });
    }
    catch (error) {
        console.error('Get lesson progress error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Update lesson progress
router.put('/lesson/:lessonId', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('progress').optional().isFloat({ min: 0, max: 1 }),
    (0, express_validator_1.body)('timeSpent').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('lastPosition').optional().trim(),
    (0, express_validator_1.body)('completed').optional().isBoolean()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
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
        const progress = await progressService_1.ProgressService.updateProgress(req.user.uid, lessonId, updates);
        res.json({
            success: true,
            data: progress,
            message: 'Progress updated successfully'
        });
    }
    catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Submit exercise result
router.post('/lesson/:lessonId/exercise', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('exerciseId').trim().notEmpty(),
    (0, express_validator_1.body)('answer').trim().notEmpty(),
    (0, express_validator_1.body)('isCorrect').isBoolean(),
    (0, express_validator_1.body)('timeSpent').isInt({ min: 0 }),
    (0, express_validator_1.body)('attempts').optional().isInt({ min: 1 })
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
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
        const progress = await progressService_1.ProgressService.submitExerciseResult(req.user.uid, lessonId, exerciseResult);
        res.json({
            success: true,
            data: progress,
            message: 'Exercise result submitted successfully'
        });
    }
    catch (error) {
        console.error('Submit exercise result error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Get user statistics
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const stats = await progressService_1.ProgressService.getUserStats(req.user.uid);
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Get progress stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=progress.js.map