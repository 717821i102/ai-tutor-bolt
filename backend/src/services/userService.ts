import { db, collections } from '../config/firebase';
import { User } from '../types';

export class UserService {
  static async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      uid: userData.uid!,
      email: userData.email!,
      displayName: userData.displayName!,
      photoURL: userData.photoURL,
      preferences: {
        difficulty: 'beginner',
        subjects: [],
        dailyGoal: 30,
        notifications: {
          email: true,
          push: true,
          reminders: true
        }
      },
      createdAt: new Date(),
      lastLogin: new Date(),
      ...userData
    };

    await db.collection(collections.users).doc(user.uid).set(user);
    return user;
  }

  static async getUserById(uid: string): Promise<User | null> {
    const doc = await db.collection(collections.users).doc(uid).get();
    if (!doc.exists) return null;
    return doc.data() as User;
  }

  static async updateUser(uid: string, updates: Partial<User>): Promise<User> {
    await db.collection(collections.users).doc(uid).update({
      ...updates,
      lastLogin: new Date()
    });
    
    const updatedUser = await this.getUserById(uid);
    if (!updatedUser) throw new Error('User not found after update');
    return updatedUser;
  }

  static async updateUserPreferences(uid: string, preferences: Partial<User['preferences']>): Promise<User> {
    const user = await this.getUserById(uid);
    if (!user) throw new Error('User not found');

    const updatedPreferences = { ...user.preferences, ...preferences };
    return this.updateUser(uid, { preferences: updatedPreferences });
  }

  static async getUserStats(uid: string) {
    // Get user's progress data
    const progressSnapshot = await db.collection(collections.progress)
      .where('userId', '==', uid)
      .get();

    const progressData = progressSnapshot.docs.map(doc => doc.data());
    
    const totalLessons = progressData.length;
    const completedLessons = progressData.filter(p => p.completed).length;
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageScore = progressData.length > 0 
      ? progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length 
      : 0;

    return {
      totalLessons,
      completedLessons,
      completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      totalTimeSpent,
      averageScore
    };
  }
}