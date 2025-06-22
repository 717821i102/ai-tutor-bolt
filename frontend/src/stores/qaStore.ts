import { create } from 'zustand';
import axios from 'axios';

export interface QAMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface QASession {
  id: string;
  userId: string;
  title: string;
  topic?: string;
  lessonId?: string;
  messages: QAMessage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QAStore {
  sessions: QASession[];
  currentSession: QASession | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSessions: () => Promise<void>;
  createSession: (title: string, topic?: string, lessonId?: string) => Promise<QASession>;
  fetchSession: (id: string) => Promise<void>;
  askQuestion: (sessionId: string, question: string) => Promise<QAMessage>;
  deleteSession: (sessionId: string) => Promise<void>;
  setCurrentSession: (session: QASession | null) => void;
  clearError: () => void;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useQAStore = create<QAStore>((set, get) => ({
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('firebase_token');
      const response = await axios.get(`${API_BASE_URL}/qa/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        set({ sessions: response.data.data, loading: false });
      } else {
        throw new Error(response.data.error || 'Failed to fetch sessions');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || error.message || 'Failed to fetch sessions',
        loading: false 
      });
    }
  },

  createSession: async (title: string, topic?: string, lessonId?: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('firebase_token');
      const response = await axios.post(
        `${API_BASE_URL}/qa/sessions`,
        { title, topic, lessonId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const newSession = response.data.data;
        set(state => ({ 
          sessions: [newSession, ...state.sessions],
          currentSession: newSession,
          loading: false 
        }));
        return newSession;
      } else {
        throw new Error(response.data.error || 'Failed to create session');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create session';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  fetchSession: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('firebase_token');
      const response = await axios.get(`${API_BASE_URL}/qa/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        set({ currentSession: response.data.data, loading: false });
      } else {
        throw new Error(response.data.error || 'Failed to fetch session');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || error.message || 'Failed to fetch session',
        loading: false 
      });
    }
  },

  askQuestion: async (sessionId: string, question: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('firebase_token');
      const response = await axios.post(
        `${API_BASE_URL}/qa/sessions/${sessionId}/ask`,
        { question },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const newMessage = response.data.data;
        
        // Update current session with new message
        set(state => {
          if (state.currentSession && state.currentSession.id === sessionId) {
            const updatedSession = {
              ...state.currentSession,
              messages: [...state.currentSession.messages, newMessage]
            };
            return {
              currentSession: updatedSession,
              loading: false
            };
          }
          return { loading: false };
        });
        
        return newMessage;
      } else {
        throw new Error(response.data.error || 'Failed to ask question');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to ask question';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  deleteSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('firebase_token');
      await axios.delete(`${API_BASE_URL}/qa/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set(state => ({
        sessions: state.sessions.filter(session => session.id !== sessionId),
        currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || error.message || 'Failed to delete session',
        loading: false 
      });
    }
  },

  setCurrentSession: (session: QASession | null) => set({ currentSession: session }),
  
  clearError: () => set({ error: null })
}));