import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  bio?: string | null;
  dob?: Date | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, metadata?: any) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Đăng nhập thất bại');
          }

          // Set cookies
          Cookies.set('accessToken', data.accessToken, { 
            expires: 1/24, // 1 hour
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          Cookies.set('refreshToken', data.refreshToken, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, metadata?: any) => {
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
              ...metadata,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Đăng ký thất bại');
          }

          // Set cookies
          Cookies.set('accessToken', data.accessToken, { 
            expires: 1/24,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          Cookies.set('refreshToken', data.refreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            isLoading: false,
          });
          throw error;
        }
      },

      refreshToken: async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Failed to refresh token');
          }

          const data = await response.json();

          // Update cookies
          Cookies.set('accessToken', data.accessToken, { 
            expires: 1/24,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      logout: () => {
        // Remove cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Tạo một custom fetch với authorization header
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const { accessToken } = useAuthStore.getState();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });
}; 