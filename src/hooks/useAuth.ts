import { create } from 'zustand';
import { User } from '@prisma/client';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    options?: RegisterOptions
  ) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

interface RegisterOptions {
  bio?: string;
  dob?: string | null;
  avatar?: string | null;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  setError: (error: string | null) => set({ error }),

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      set({ 
        user: data.user, 
        accessToken: data.accessToken,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (
    name: string, 
    email: string, 
    password: string,
    options?: RegisterOptions
  ) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          bio: options?.bio,
          dob: options?.dob,
          avatar: options?.avatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      set({ 
        user: data.user, 
        accessToken: data.accessToken,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, accessToken: null });
  },
})); 