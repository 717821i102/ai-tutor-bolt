export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    subjects: string[];
    dailyGoal: number;
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
    };
  };
  createdAt: Date;
  lastLogin: Date;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  summary: string;
  content: ContentSection[];
  exercises: Exercise[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
  views: number;
  isPublic: boolean;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'video' | 'image' | 'code';
  mediaUrl?: string;
}

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  progress: number; // 0-1
  completed: boolean;
  score?: number; // 0-100
  timeSpent: number; // seconds
  lastPosition: string;
  completionDate?: Date;
  attempts: number;
  exerciseResults: ExerciseResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseResult {
  exerciseId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
}

export interface QASession {
  id: string;
  userId: string;
  title: string;
  topic?: string;
  lessonId?: string;
  messages: QAMessage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QAMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  references?: Reference[];
}

export interface Reference {
  title: string;
  source: string;
  url?: string;
}

export interface LessonGenerationRequest {
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  learningObjectives?: string[];
  includeExercises?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}