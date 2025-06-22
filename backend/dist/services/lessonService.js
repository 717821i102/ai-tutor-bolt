"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const firebase_1 = require("../config/firebase");
const gemini_1 = require("../config/gemini");
class LessonService {
    static async createLesson(lessonData, createdBy) {
        const lesson = {
            id: firebase_1.db.collection(firebase_1.collections.lessons).doc().id,
            title: lessonData.title,
            subject: lessonData.subject,
            topic: lessonData.topic,
            difficulty: lessonData.difficulty,
            durationMinutes: lessonData.durationMinutes,
            summary: lessonData.summary,
            content: lessonData.content || [],
            exercises: lessonData.exercises || [],
            tags: lessonData.tags || [],
            createdBy,
            createdAt: new Date(),
            views: 0,
            isPublic: true,
            ...lessonData
        };
        await firebase_1.db.collection(firebase_1.collections.lessons).doc(lesson.id).set(lesson);
        return lesson;
    }
    static async generateLessonWithAI(request, createdBy) {
        try {
            const aiContent = await (0, gemini_1.generateLesson)(request.subject, request.topic, request.difficulty, request.durationMinutes, request.learningObjectives);
            // Add IDs to content sections and exercises
            const contentWithIds = aiContent.content.map((section, index) => ({
                ...section,
                id: `section_${index + 1}`,
                order: index + 1
            }));
            const exercisesWithIds = aiContent.exercises.map((exercise, index) => ({
                ...exercise,
                id: `exercise_${index + 1}`,
                difficulty: request.difficulty
            }));
            const lesson = {
                id: firebase_1.db.collection(firebase_1.collections.lessons).doc().id,
                title: aiContent.title,
                subject: request.subject,
                topic: request.topic,
                difficulty: request.difficulty,
                durationMinutes: request.durationMinutes,
                summary: aiContent.summary,
                content: contentWithIds,
                exercises: exercisesWithIds,
                tags: aiContent.tags || [request.subject, request.topic],
                createdBy,
                createdAt: new Date(),
                views: 0,
                isPublic: true
            };
            await firebase_1.db.collection(firebase_1.collections.lessons).doc(lesson.id).set(lesson);
            return lesson;
        }
        catch (error) {
            console.error('Error generating lesson with AI:', error);
            throw new Error('Failed to generate lesson');
        }
    }
    static async getLessonById(id) {
        const doc = await firebase_1.db.collection(firebase_1.collections.lessons).doc(id).get();
        if (!doc.exists)
            return null;
        // Increment view count
        await firebase_1.db.collection(firebase_1.collections.lessons).doc(id).update({
            views: (doc.data()?.views || 0) + 1
        });
        return { ...doc.data(), views: (doc.data()?.views || 0) + 1 };
    }
    static async getLessons(filters = {}) {
        let query = firebase_1.db.collection(firebase_1.collections.lessons).where('isPublic', '==', true);
        if (filters.subject) {
            query = query.where('subject', '==', filters.subject);
        }
        if (filters.difficulty) {
            query = query.where('difficulty', '==', filters.difficulty);
        }
        query = query.orderBy('createdAt', 'desc');
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        const snapshot = await query.get();
        let lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Client-side search filtering (Firestore doesn't support full-text search)
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            lessons = lessons.filter(lesson => lesson.title.toLowerCase().includes(searchTerm) ||
                lesson.summary.toLowerCase().includes(searchTerm) ||
                lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        }
        return lessons;
    }
    static async getUserLessons(userId) {
        const snapshot = await firebase_1.db.collection(firebase_1.collections.lessons)
            .where('createdBy', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    static async deleteLesson(id, userId) {
        const lesson = await this.getLessonById(id);
        if (!lesson)
            throw new Error('Lesson not found');
        if (lesson.createdBy !== userId)
            throw new Error('Unauthorized');
        await firebase_1.db.collection(firebase_1.collections.lessons).doc(id).delete();
    }
    static async getSubjects() {
        const snapshot = await firebase_1.db.collection(firebase_1.collections.lessons)
            .where('isPublic', '==', true)
            .get();
        const subjects = new Set();
        snapshot.docs.forEach(doc => {
            const lesson = doc.data();
            subjects.add(lesson.subject);
        });
        return Array.from(subjects).sort();
    }
}
exports.LessonService = LessonService;
//# sourceMappingURL=lessonService.js.map