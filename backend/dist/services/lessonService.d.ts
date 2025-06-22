import { Lesson, LessonGenerationRequest } from '../types';
export declare class LessonService {
    static createLesson(lessonData: Partial<Lesson>, createdBy: string): Promise<Lesson>;
    static generateLessonWithAI(request: LessonGenerationRequest, createdBy: string): Promise<Lesson>;
    static getLessonById(id: string): Promise<Lesson | null>;
    static getLessons(filters?: {
        subject?: string;
        difficulty?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<Lesson[]>;
    static getUserLessons(userId: string): Promise<Lesson[]>;
    static deleteLesson(id: string, userId: string): Promise<void>;
    static getSubjects(): Promise<string[]>;
}
//# sourceMappingURL=lessonService.d.ts.map