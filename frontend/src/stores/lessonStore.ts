import { create } from 'zustand';
import axios from 'axios';

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
  createdAt: string;
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

export interface LessonGenerationRequest {
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  learningObjectives?: string[];
  includeExercises?: boolean;
}

interface LessonStore {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  subjects: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchLessons: (filters?: {
    subject?: string;
    difficulty?: string;
    search?: string;
  }) => Promise<void>;
  fetchLessonById: (id: string) => Promise<void>;
  generateLesson: (request: LessonGenerationRequest) => Promise<Lesson>;
  fetchSubjects: () => Promise<void>;
  clearError: () => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useLessonStore = create<LessonStore>((set, get) => ({
  lessons: [],
  currentLesson: null,
  subjects: [],
  loading: false,
  error: null,

  fetchLessons: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_BASE_URL}/lessons?${params}`);
      
      if (response.data.success) {
        set({ lessons: response.data.data.lessons, loading: false });
      } else {
        throw new Error(response.data.error || 'Failed to fetch lessons');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || error.message || 'Failed to fetch lessons',
        loading: false 
      });
    }
  },

  fetchLessonById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/${id}`);
      
      if (response.data.success) {
        set({ currentLesson: response.data.data, loading: false });
      } else {
        throw new Error(response.data.error || 'Failed to fetch lesson');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || error.message || 'Failed to fetch lesson',
        loading: false 
      });
    }
  },

  generateLesson: async (request: LessonGenerationRequest) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('firebase_token');
      const response = await axios.post(
        `${API_BASE_URL}/lessons/generate`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const newLesson = response.data.data;
        set(state => ({ 
          lessons: [newLesson, ...state.lessons],
          currentLesson: newLesson,
          loading: false 
        }));
        return newLesson;
      } else {
        throw new Error(response.data.error || 'Failed to generate lesson');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate lesson';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  fetchSubjects: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/meta/subjects`);
      
      if (response.data.success) {
        set({ subjects: response.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch subjects:', error);
    }
  },

  clearError: () => set({ error: null }),
  
  setCurrentLesson: (lesson: Lesson | null) => set({ currentLesson: lesson })
}));