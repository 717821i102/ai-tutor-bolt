import { LessonGenerateRequest, Lesson, QARequest } from '../types';
declare class GeminiService {
    private genAI;
    private model;
    constructor();
    generateLesson(request: LessonGenerateRequest): Promise<Partial<Lesson>>;
    answerQuestion(request: QARequest): Promise<{
        answer: string;
        references: any[];
    }>;
    generateLessonRecommendations(userPreferences: any, completedLessons: string[]): Promise<string[]>;
}
export declare const geminiService: GeminiService;
export {};
//# sourceMappingURL=geminiService.d.ts.map