import { User } from '../types';
export declare class UserService {
    static createUser(userData: Partial<User>): Promise<User>;
    static getUserById(uid: string): Promise<User | null>;
    static updateUser(uid: string, updates: Partial<User>): Promise<User>;
    static updateUserPreferences(uid: string, preferences: Partial<User['preferences']>): Promise<User>;
    static getUserStats(uid: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        completionRate: number;
        totalTimeSpent: number;
        averageScore: number;
    }>;
}
//# sourceMappingURL=userService.d.ts.map