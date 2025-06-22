"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const firebase_1 = require("../config/firebase");
class ProgressService {
    static async getOrCreateProgress(userId, lessonId) {
        const progressId = `${userId}_${lessonId}`;
        const doc = await firebase_1.db.collection(firebase_1.collections.progress).doc(progressId).get();
        if (doc.exists) {
            return doc.data();
        }
        // Create new progress record
        const progress = {
            id: progressId,
            userId,
            lessonId,
            progress: 0,
            completed: false,
            timeSpent: 0,
            lastPosition: '',
            attempts: 0,
            exerciseResults: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await firebase_1.db.collection(firebase_1.collections.progress).doc(progressId).set(progress);
        return progress;
    }
    static async updateProgress(userId, lessonId, updates) {
        const progressId = `${userId}_${lessonId}`;
        const currentProgress = await this.getOrCreateProgress(userId, lessonId);
        const updatedProgress = {
            ...currentProgress,
            ...updates,
            updatedAt: new Date()
        };
        // Auto-complete if progress reaches 100%
        if (updatedProgress.progress >= 1 && !updatedProgress.completed) {
            updatedProgress.completed = true;
            updatedProgress.completionDate = new Date();
        }
        await firebase_1.db.collection(firebase_1.collections.progress).doc(progressId).update(updatedProgress);
        return updatedProgress;
    }
    static async submitExerciseResult(userId, lessonId, exerciseResult) {
        const progress = await this.getOrCreateProgress(userId, lessonId);
        // Update or add exercise result
        const existingIndex = progress.exerciseResults.findIndex(result => result.exerciseId === exerciseResult.exerciseId);
        if (existingIndex >= 0) {
            progress.exerciseResults[existingIndex] = exerciseResult;
        }
        else {
            progress.exerciseResults.push(exerciseResult);
        }
        // Calculate overall score
        const totalCorrect = progress.exerciseResults.filter(result => result.isCorrect).length;
        const score = progress.exerciseResults.length > 0
            ? (totalCorrect / progress.exerciseResults.length) * 100
            : 0;
        return this.updateProgress(userId, lessonId, {
            exerciseResults: progress.exerciseResults,
            score,
            attempts: progress.attempts + 1
        });
    }
    static async getUserProgress(userId) {
        const snapshot = await firebase_1.db.collection(firebase_1.collections.progress)
            .where('userId', '==', userId)
            .orderBy('updatedAt', 'desc')
            .get();
        return snapshot.docs.map(doc => doc.data());
    }
    static async getLessonProgress(userId, lessonId) {
        const progressId = `${userId}_${lessonId}`;
        const doc = await firebase_1.db.collection(firebase_1.collections.progress).doc(progressId).get();
        if (!doc.exists)
            return null;
        return doc.data();
    }
    static async getUserStats(userId) {
        const progressData = await this.getUserProgress(userId);
        const totalLessons = progressData.length;
        const completedLessons = progressData.filter(p => p.completed).length;
        const totalTimeSpent = progressData.reduce((sum, p) => sum + p.timeSpent, 0);
        const averageScore = progressData.length > 0
            ? progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length
            : 0;
        // Calculate weekly progress (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyProgress = progressData.filter(p => p.updatedAt >= oneWeekAgo).length;
        return {
            totalLessons,
            completedLessons,
            completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
            totalTimeSpent,
            averageScore,
            weeklyProgress
        };
    }
}
exports.ProgressService = ProgressService;
//# sourceMappingURL=progressService.js.map