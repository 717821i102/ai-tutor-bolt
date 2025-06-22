"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QAService = void 0;
const firebase_1 = require("../config/firebase");
const gemini_1 = require("../config/gemini");
class QAService {
    static async createSession(userId, title, topic, lessonId) {
        const session = {
            id: firebase_1.db.collection(firebase_1.collections.qaSessions).doc().id,
            userId,
            title,
            topic,
            lessonId,
            messages: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await firebase_1.db.collection(firebase_1.collections.qaSessions).doc(session.id).set(session);
        return session;
    }
    static async getSessionById(id) {
        const doc = await firebase_1.db.collection(firebase_1.collections.qaSessions).doc(id).get();
        if (!doc.exists)
            return null;
        return doc.data();
    }
    static async getUserSessions(userId) {
        const snapshot = await firebase_1.db.collection(firebase_1.collections.qaSessions)
            .where('userId', '==', userId)
            .where('isActive', '==', true)
            .orderBy('updatedAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    static async askQuestion(sessionId, question, userId) {
        const session = await this.getSessionById(sessionId);
        if (!session)
            throw new Error('Session not found');
        if (session.userId !== userId)
            throw new Error('Unauthorized');
        try {
            // Get context from lesson if available
            let context = '';
            if (session.lessonId) {
                const lessonDoc = await firebase_1.db.collection(firebase_1.collections.lessons).doc(session.lessonId).get();
                if (lessonDoc.exists) {
                    const lesson = lessonDoc.data();
                    context = `Lesson: ${lesson?.title}\nSummary: ${lesson?.summary}`;
                }
            }
            // Generate AI response
            const answer = await (0, gemini_1.generateQAResponse)(question, context, session.messages);
            const message = {
                id: `msg_${Date.now()}`,
                question,
                answer,
                timestamp: new Date()
            };
            // Update session with new message
            const updatedMessages = [...session.messages, message];
            await firebase_1.db.collection(firebase_1.collections.qaSessions).doc(sessionId).update({
                messages: updatedMessages,
                updatedAt: new Date()
            });
            return message;
        }
        catch (error) {
            console.error('Error asking question:', error);
            throw new Error('Failed to generate response');
        }
    }
    static async deleteSession(sessionId, userId) {
        const session = await this.getSessionById(sessionId);
        if (!session)
            throw new Error('Session not found');
        if (session.userId !== userId)
            throw new Error('Unauthorized');
        await firebase_1.db.collection(firebase_1.collections.qaSessions).doc(sessionId).update({
            isActive: false
        });
    }
    static async updateSessionTitle(sessionId, title, userId) {
        const session = await this.getSessionById(sessionId);
        if (!session)
            throw new Error('Session not found');
        if (session.userId !== userId)
            throw new Error('Unauthorized');
        await firebase_1.db.collection(firebase_1.collections.qaSessions).doc(sessionId).update({
            title,
            updatedAt: new Date()
        });
    }
}
exports.QAService = QAService;
//# sourceMappingURL=qaService.js.map