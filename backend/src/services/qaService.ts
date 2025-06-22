import { db, collections } from '../config/firebase';
import { QASession, QAMessage } from '../types';
import { generateQAResponse } from '../config/gemini';

export class QAService {
  static async createSession(userId: string, title: string, topic?: string, lessonId?: string): Promise<QASession> {
    const session: QASession = {
      id: db.collection(collections.qaSessions).doc().id,
      userId,
      title,
      topic,
      lessonId,
      messages: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection(collections.qaSessions).doc(session.id).set(session);
    return session;
  }

  static async getSessionById(id: string): Promise<QASession | null> {
    const doc = await db.collection(collections.qaSessions).doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as QASession;
  }

  static async getUserSessions(userId: string): Promise<QASession[]> {
    const snapshot = await db.collection(collections.qaSessions)
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QASession));
  }

  static async askQuestion(sessionId: string, question: string, userId: string): Promise<QAMessage> {
    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.userId !== userId) throw new Error('Unauthorized');

    try {
      // Get context from lesson if available
      let context = '';
      if (session.lessonId) {
        const lessonDoc = await db.collection(collections.lessons).doc(session.lessonId).get();
        if (lessonDoc.exists) {
          const lesson = lessonDoc.data();
          context = `Lesson: ${lesson?.title}\nSummary: ${lesson?.summary}`;
        }
      }

      // Generate AI response
      const answer = await generateQAResponse(question, context, session.messages);

      const message: QAMessage = {
        id: `msg_${Date.now()}`,
        question,
        answer,
        timestamp: new Date()
      };

      // Update session with new message
      const updatedMessages = [...session.messages, message];
      await db.collection(collections.qaSessions).doc(sessionId).update({
        messages: updatedMessages,
        updatedAt: new Date()
      });

      return message;
    } catch (error) {
      console.error('Error asking question:', error);
      throw new Error('Failed to generate response');
    }
  }

  static async deleteSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.userId !== userId) throw new Error('Unauthorized');

    await db.collection(collections.qaSessions).doc(sessionId).update({
      isActive: false
    });
  }

  static async updateSessionTitle(sessionId: string, title: string, userId: string): Promise<void> {
    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.userId !== userId) throw new Error('Unauthorized');

    await db.collection(collections.qaSessions).doc(sessionId).update({
      title,
      updatedAt: new Date()
    });
  }
}