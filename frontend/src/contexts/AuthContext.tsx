import React, { createContext, useContext, useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import { auth } from '../config/firebase';
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
<<<<<<< HEAD
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences?: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    subjects: string[];
    dailyGoal: number;
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
    };
  };
=======
  signInWithPopup
} from 'firebase/auth';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
<<<<<<< HEAD
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
=======
  token: string | null;
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  // Set up axios interceptor for auth token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('firebase_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);
=======
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
<<<<<<< HEAD
          // Get Firebase ID token
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('firebase_token', token);

          // Fetch user data from backend
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/me`);
          
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Auth error:', error);
          setUser(null);
          localStorage.removeItem('firebase_token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('firebase_token');
=======
          const idToken = await firebaseUser.getIdToken();
          const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/firebase`, {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            avatarUrl: firebaseUser.photoURL
          });

          const { token: jwtToken, user: userData } = response.data;
          setToken(jwtToken);
          setUser(userData);
          localStorage.setItem('token', jwtToken);
          
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        } catch (error) {
          console.error('Firebase auth error:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
<<<<<<< HEAD
    await updateProfile(userCredential.user, { displayName });
=======
    // Update display name
    await userCredential.user.updateProfile({ displayName });
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

<<<<<<< HEAD
  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/auth/me`, updates);
      
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

=======
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
<<<<<<< HEAD
    updateUserProfile
=======
    token
>>>>>>> 73456183a892c1def48b1b01a40249c86a5e07dc
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};