"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userService_1 = require("../services/userService");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get current user profile
router.get('/me', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await userService_1.userService.getUserById(req.user.uid);
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
router.put('/me', (0, express_validator_1.body)('displayName').optional().isLength({ min: 2 }).withMessage('Display name must be at least 2 characters'), (0, express_validator_1.body)('photoURL').optional().isURL().withMessage('Photo URL must be valid'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array(),
        });
    }
    const { displayName, photoURL } = req.body;
    const updatedUser = await userService_1.userService.updateUser(req.user.uid, {
        displayName,
        photoURL,
    });
    res.json({
        success: true,
        data: updatedUser,
    });
}));
// Get user progress
router.get('/me/progress', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const progress = await userService_1.userService.getUserProgress(req.user.uid);
    res.json({
        success: true,
        data: progress,
    });
}));
// Update user preferences
router.put('/me/preferences', (0, express_validator_1.body)('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced', 'adaptive']), (0, express_validator_1.body)('subjects').optional().isArray(), (0, express_validator_1.body)('learningStyle').optional().isIn(['visual', 'auditory', 'kinesthetic', 'reading']), (0, express_validator_1.body)('dailyGoal').optional().isInt({ min: 1, max: 10 }), (0, express_validator_1.body)('weeklyGoal').optional().isInt({ min: 1, max: 50 }), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array(),
        });
    }
    const updatedUser = await userService_1.userService.updateUserPreferences(req.user.uid, req.body);
    res.json({
        success: true,
        data: updatedUser,
    });
}));
// Update lesson progress
router.post('/me/lessons/:lessonId/progress', (0, express_validator_1.body)('progress').isFloat({ min: 0, max: 1 }).withMessage('Progress must be between 0 and 1'), (0, express_validator_1.body)('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a positive integer'), (0, express_validator_1.body)('completed').optional().isBoolean(), (0, express_validator_1.body)('score').optional().isFloat({ min: 0, max: 100 }), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array(),
        });
    }
    const { lessonId } = req.params;
    const progressData = req.body;
    const updatedProgress = await userService_1.userService.updateLessonProgress(req.user.uid, lessonId, progressData);
    res.json({
        success: true,
        data: updatedProgress,
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map