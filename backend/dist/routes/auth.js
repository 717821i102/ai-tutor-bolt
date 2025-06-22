"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userService_1 = require("../services/userService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get current user
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        let user = await userService_1.UserService.getUserById(req.user.uid);
        if (!user) {
            // Create user if doesn't exist
            user = await userService_1.UserService.createUser({
                uid: req.user.uid,
                email: req.user.email,
                displayName: req.user.name || req.user.email.split('@')[0]
            });
        }
        else {
            // Update last login
            user = await userService_1.UserService.updateUser(req.user.uid, { lastLogin: new Date() });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Update user profile
router.put('/me', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('displayName').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('preferences').optional().isObject()
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
        const { displayName, preferences } = req.body;
        const updates = {};
        if (displayName)
            updates.displayName = displayName;
        if (preferences)
            updates.preferences = preferences;
        const user = await userService_1.UserService.updateUser(req.user.uid, updates);
        res.json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Get user statistics
router.get('/me/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const stats = await userService_1.UserService.getUserStats(req.user.uid);
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map