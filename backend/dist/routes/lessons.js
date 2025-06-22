"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const lessonService_1 = require("../services/lessonService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all lessons with filters
router.get('/', [
    (0, express_validator_1.query)('subject').optional().trim(),
    (0, express_validator_1.query)('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    (0, express_validator_1.query)('search').optional().trim(),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('offset').optional().isInt({ min: 0 })
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
        const { subject, difficulty, search, limit, offset } = req.query;
        const lessons = await lessonService_1.LessonService.getLessons({
            subject: subject,
            difficulty: difficulty,
            search: search,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined
        });
        res.json({
            success: true,
            data: {
                lessons,
                total: lessons.length
            }
        });
    }
    catch (error) {
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
        const lesson = await lessonService_1.LessonService.getLessonById(id);
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
    }
    catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Generate lesson with AI
router.post('/generate', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('subject').trim().notEmpty(),
    (0, express_validator_1.body)('topic').trim().notEmpty(),
    (0, express_validator_1.body)('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
    (0, express_validator_1.body)('durationMinutes').isInt({ min: 5, max: 180 }),
    (0, express_validator_1.body)('learningObjectives').optional().isArray(),
    (0, express_validator_1.body)('includeExercises').optional().isBoolean()
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
        const lesson = await lessonService_1.LessonService.generateLessonWithAI(req.body, req.user.uid);
        res.json({
            success: true,
            data: lesson,
            message: 'Lesson generated successfully'
        });
    }
    catch (error) {
        console.error('Generate lesson error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate lesson'
        });
    }
});
// Create manual lesson
router.post('/', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('title').trim().notEmpty(),
    (0, express_validator_1.body)('subject').trim().notEmpty(),
    (0, express_validator_1.body)('topic').trim().notEmpty(),
    (0, express_validator_1.body)('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
    (0, express_validator_1.body)('durationMinutes').isInt({ min: 5, max: 180 }),
    (0, express_validator_1.body)('summary').trim().notEmpty(),
    (0, express_validator_1.body)('content').isArray(),
    (0, express_validator_1.body)('exercises').optional().isArray(),
    (0, express_validator_1.body)('tags').optional().isArray()
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
        const lesson = await lessonService_1.LessonService.createLesson(req.body, req.user.uid);
        res.status(201).json({
            success: true,
            data: lesson,
            message: 'Lesson created successfully'
        });
    }
    catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Get user's lessons
router.get('/user/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const lessons = await lessonService_1.LessonService.getUserLessons(req.user.uid);
        res.json({
            success: true,
            data: lessons
        });
    }
    catch (error) {
        console.error('Get user lessons error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Delete lesson
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user?.uid) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const { id } = req.params;
        await lessonService_1.LessonService.deleteLesson(id, req.user.uid);
        res.json({
            success: true,
            message: 'Lesson deleted successfully'
        });
    }
    catch (error) {
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
        const subjects = await lessonService_1.LessonService.getSubjects();
        res.json({
            success: true,
            data: subjects
        });
    }
    catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=lessons.js.map