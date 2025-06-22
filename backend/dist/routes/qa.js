"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const qaService_1 = require("../services/qaService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get user's QA sessions
router.get('/sessions', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const sessions = await qaService_1.QAService.getUserSessions(req.user.uid);
        res.json({
            success: true,
            data: sessions
        });
    }
    catch (error) {
        console.error('Get QA sessions error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Create new QA session
router.post('/sessions', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('title').trim().notEmpty(),
    (0, express_validator_1.body)('topic').optional().trim(),
    (0, express_validator_1.body)('lessonId').optional().trim()
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
        const { title, topic, lessonId } = req.body;
        const session = await qaService_1.QAService.createSession(req.user.uid, title, topic, lessonId);
        res.status(201).json({
            success: true,
            data: session,
            message: 'QA session created successfully'
        });
    }
    catch (error) {
        console.error('Create QA session error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Get specific QA session
router.get('/sessions/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const { id } = req.params;
        const session = await qaService_1.QAService.getSessionById(id);
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
    }
    catch (error) {
        console.error('Get QA session error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Ask question in session
router.post('/sessions/:id/ask', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('question').trim().notEmpty()
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
        const { id } = req.params;
        const { question } = req.body;
        const message = await qaService_1.QAService.askQuestion(id, question, req.user.uid);
        res.json({
            success: true,
            data: message,
            message: 'Question answered successfully'
        });
    }
    catch (error) {
        console.error('Ask question error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
// Update session title
router.put('/sessions/:id', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('title').trim().notEmpty()
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
        const { id } = req.params;
        const { title } = req.body;
        await qaService_1.QAService.updateSessionTitle(id, title, req.user.uid);
        res.json({
            success: true,
            message: 'Session title updated successfully'
        });
    }
    catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
// Delete QA session
router.delete('/sessions/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const { id } = req.params;
        await qaService_1.QAService.deleteSession(id, req.user.uid);
        res.json({
            success: true,
            message: 'Session deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=qa.js.map