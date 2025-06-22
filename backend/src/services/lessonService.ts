import { db, collections } from '../config/firebase';
import { Lesson, LessonGenerationRequest } from '../types';
import { generateLesson } from '../config/gemini';

export class LessonService {
  static async createLesson(lessonData: Partial<Lesson>, createdBy: string): Promise<Lesson> {
    const lesson: Lesson = {
      id: db.collection(collections.lessons).doc().id,
      title: lessonData.title!,
      subject: lessonData.subject!,
      topic: lessonData.topic!,
      difficulty: lessonData.difficulty!,
      durationMinutes: lessonData.durationMinutes!,
      summary: lessonData.summary!,
      content: lessonData.content || [],
      exercises: lessonData.exercises || [],
      tags: lessonData.tags || [],
      createdBy,
      createdAt: new Date(),
      views: 0,
      isPublic: true,
      ...lessonData
    };

    await db.collection(collections.lessons).doc(lesson.id).set(lesson);
    return lesson;
  }

  static async generateLessonWithAI(request: LessonGenerationRequest, createdBy: string): Promise<Lesson> {
    try {
      const aiContent = await generateLesson(
        request.subject,
        request.topic,
        request.difficulty,
        request.durationMinutes,
        request.learningObjectives
      );

      // Add IDs to content sections and exercises
      const contentWithIds = aiContent.content.map((section: any, index: number) => ({
        ...section,
        id: `section_${index + 1}`,
        order: index + 1
      }));

      const exercisesWithIds = aiContent.exercises.map((exercise: any, index: number) => ({
        ...exercise,
        id: `exercise_${index + 1}`,
        difficulty: request.difficulty
      }));

      const lesson: Lesson = {
        id: db.collection(collections.lessons).doc().id,
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

      await db.collection(collections.lessons).doc(lesson.id).set(lesson);
      return lesson;
    } catch (error) {
      console.error('Error generating lesson with AI:', error);
      throw new Error('Failed to generate lesson');
    }
  }

  static async getLessonById(id: string): Promise<Lesson | null> {
    const doc = await db.collection(collections.lessons).doc(id).get();
    if (!doc.exists) return null;
    
    // Increment view count
    await db.collection(collections.lessons).doc(id).update({
      views: (doc.data()?.views || 0) + 1
    });
    
    return { ...doc.data(), views: (doc.data()?.views || 0) + 1 } as Lesson;
  }

  static async getLessons(filters: {
    subject?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = db.collection(collections.lessons).where('isPublic', '==', true);

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
    let lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));

    // Client-side search filtering (Firestore doesn't support full-text search)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      lessons = lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.summary.toLowerCase().includes(searchTerm) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return lessons;
  }

  static async getUserLessons(userId: string): Promise<Lesson[]> {
    const snapshot = await db.collection(collections.lessons)
      .where('createdBy', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  }

  static async deleteLesson(id: string, userId: string): Promise<void> {
    const lesson = await this.getLessonById(id);
    if (!lesson) throw new Error('Lesson not found');
    if (lesson.createdBy !== userId) throw new Error('Unauthorized');

    await db.collection(collections.lessons).doc(id).delete();
  }

  static async getSubjects(): Promise<string[]> {
    const snapshot = await db.collection(collections.lessons)
      .where('isPublic', '==', true)
      .get();

    const subjects = new Set<string>();
    snapshot.docs.forEach(doc => {
      const lesson = doc.data() as Lesson;
      subjects.add(lesson.subject);
    });

    return Array.from(subjects).sort();
  }
}