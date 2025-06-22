"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userService_1 = require("../services/userService");
const qaService_1 = require("../services/qaService");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get dashboard analytics
router.get('/dashboard', (0, express_validator_1.query)('range').optional().isIn(['7d', '30d', '90d', '1y']), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { range = '30d' } = req.query;
    // Get user progress
    const progress = await userService_1.userService.getUserProgress(req.user.uid);
    // Get QA history
    const qaHistory = await qaService_1.qaService.getQAHistory(req.user.uid, 100);
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (range) {
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case '1y':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default: // 30d
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    // Filter data by date range
    const filteredLessons = progress.completedLessons.filter(lesson => lesson.completedAt && lesson.completedAt >= startDate);
    const filteredQuestions = qaHistory.messages.filter(message => new Date(message.createdAt) >= startDate);
    // Calculate overview statistics
    const overview = {
        totalLessonsCompleted: filteredLessons.length,
        totalTimeSpent: filteredLessons.reduce((sum, lesson) => sum + lesson.timeSpent, 0),
        totalQuestionsAsked: filteredQuestions.length,
        currentStreak: progress.statistics.streak || 0,
        averageScore: filteredLessons.length > 0
            ? filteredLessons
                .filter(lesson => lesson.score !== undefined)
                .reduce((sum, lesson) => sum + (lesson.score || 0), 0) /
                filteredLessons.filter(lesson => lesson.score !== undefined).length
            : 0,
        lessonsThisWeek: progress.statistics.completedThisWeek || 0,
        lessonsThisMonth: filteredLessons.filter(lesson => lesson.completedAt &&
            lesson.completedAt >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)).length,
        improvementRate: 12.5, // Mock data - calculate based on score trends
    };
    // Generate daily activity data
    const dailyActivity = generateDailyActivity(filteredLessons, filteredQuestions, startDate, now);
    // Generate subject breakdown
    const subjectBreakdown = generateSubjectBreakdown(filteredLessons);
    // Generate difficulty progress
    const difficultyProgress = generateDifficultyProgress(progress.completedLessons);
    // Weekly goals
    const weeklyGoals = {
        currentWeek: progress.statistics.completedThisWeek || 0,
        goal: progress.statistics.weeklyGoal || 7,
        completionRate: Math.round(((progress.statistics.completedThisWeek || 0) / (progress.statistics.weeklyGoal || 7)) * 100),
        streak: progress.statistics.streak || 0,
    };
    // Learning trends (weekly data)
    const learningTrends = generateLearningTrends(filteredLessons, startDate, now);
    res.json({
        success: true,
        data: {
            overview,
            dailyActivity,
            subjectBreakdown,
            difficultyProgress,
            weeklyGoals,
            learningTrends,
        },
    });
}));
// Helper functions
function generateDailyActivity(lessons, questions, startDate, endDate) {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const activity = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const dayLessons = lessons.filter(lesson => lesson.completedAt &&
            lesson.completedAt.toISOString().split('T')[0] === dateStr);
        const dayQuestions = questions.filter(question => new Date(question.createdAt).toISOString().split('T')[0] === dateStr);
        activity.push({
            date: dateStr,
            lessonsCompleted: dayLessons.length,
            timeSpent: dayLessons.reduce((sum, lesson) => sum + lesson.timeSpent, 0),
            questionsAsked: dayQuestions.length,
        });
    }
    return activity;
}
function generateSubjectBreakdown(lessons) {
    const subjects = {};
    lessons.forEach(lesson => {
        // Mock subject data since it's not in UserProgress
        const subject = 'Mathematics'; // This should come from lesson data
        if (!subjects[subject]) {
            subjects[subject] = { lessonsCompleted: 0, timeSpent: 0, scores: [] };
        }
        subjects[subject].lessonsCompleted++;
        subjects[subject].timeSpent += lesson.timeSpent;
        if (lesson.score !== undefined) {
            subjects[subject].scores.push(lesson.score);
        }
    });
    return Object.entries(subjects).map(([subject, data]) => ({
        subject,
        lessonsCompleted: data.lessonsCompleted,
        timeSpent: data.timeSpent,
        averageScore: data.scores.length > 0
            ? data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
            : 0,
    }));
}
function generateDifficultyProgress(lessons) {
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    return difficulties.map(difficulty => {
        // Mock data - this should be calculated from actual lesson difficulties
        const completed = Math.floor(Math.random() * 15) + 1;
        const total = completed + Math.floor(Math.random() * 10);
        return {
            difficulty,
            completed,
            total,
            percentage: Math.round((completed / total) * 100),
        };
    });
}
function generateLearningTrends(lessons, startDate, endDate) {
    const weeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const trends = [];
    for (let i = 0; i < Math.min(weeks, 8); i++) {
        const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        const weekLessons = lessons.filter(lesson => lesson.completedAt &&
            lesson.completedAt >= weekStart &&
            lesson.completedAt < weekEnd);
        const avgScore = weekLessons.length > 0
            ? weekLessons
                .filter(lesson => lesson.score !== undefined)
                .reduce((sum, lesson) => sum + (lesson.score || 0), 0) /
                weekLessons.filter(lesson => lesson.score !== undefined).length
            : 0;
        trends.push({
            week: `Week ${i + 1}`,
            lessons: weekLessons.length,
            time: weekLessons.reduce((sum, lesson) => sum + lesson.timeSpent, 0),
            score: Math.round(avgScore),
        });
    }
    return trends;
}
exports.default = router;
//# sourceMappingURL=analytics.js.map