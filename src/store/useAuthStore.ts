import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

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

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${get().accessToken}`
            }
          });

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng xuất thất bại',
            isLoading: false,
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error);
          }

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });

        } catch (error) {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'Làm mới token thất bại',
          });
        }
      },

      clearError: () => set({ error: null }),

      isAdmin: () => {
        const state = get();
        return state.user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage', // tên của storage key
      partialize: (state) => ({ 
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }), // chỉ lưu những field cần thiết
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
  });
}; 