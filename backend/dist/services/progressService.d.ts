import { Progress, ExerciseResult } from '../types';
export declare class ProgressService {
    static getOrCreateProgress(userId: string, lessonId: string): Promise<Progress>;
    static updateProgress(userId: string, lessonId: string, updates: Partial<Progress>): Promise<Progress>;
    static submitExerciseResult(userId: string, lessonId: string, exerciseResult: ExerciseResult): Promise<Progress>;
    static getUserProgress(userId: string): Promise<Progress[]>;
    static getLessonProgress(userId: string, lessonId: string): Promise<Progress | null>;
    static getUserStats(userId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        completionRate: number;
        totalTimeSpent: number;
        averageScore: number;
        weeklyProgress: number;
    }>;
}
//# sourceMappingURL=progressService.d.ts.map