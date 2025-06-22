import { QASession, QAMessage } from '../types';
export declare class QAService {
    static createSession(userId: string, title: string, topic?: string, lessonId?: string): Promise<QASession>;
    static getSessionById(id: string): Promise<QASession | null>;
    static getUserSessions(userId: string): Promise<QASession[]>;
    static askQuestion(sessionId: string, question: string, userId: string): Promise<QAMessage>;
    static deleteSession(sessionId: string, userId: string): Promise<void>;
    static updateSessionTitle(sessionId: string, title: string, userId: string): Promise<void>;
}
//# sourceMappingURL=qaService.d.ts.map