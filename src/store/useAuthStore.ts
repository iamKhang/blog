import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

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
  isRefreshing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, metadata?: any) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  checkTokenExpiry: () => void;
}

let refreshInterval: NodeJS.Timeout | null = null;
let refreshPromise: Promise<boolean> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isRefreshing: false,

      checkTokenExpiry: () => {
        const { accessToken, isAuthenticated } = get();
        if (!accessToken || !isAuthenticated) return;

        try {
          const decoded = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp) {
            const timeUntilExpiry = decoded.exp - currentTime;
            console.log('🔍 Token Debug:', {
              currentTime: new Date(currentTime * 1000).toISOString(),
              tokenExpiry: new Date(decoded.exp * 1000).toISOString(),
              timeUntilExpiry: timeUntilExpiry,
              minutesUntilExpiry: Math.floor(timeUntilExpiry / 60)
            });
            
            // Nếu token sắp hết hạn trong vòng 5 phút (300 giây)
            if (timeUntilExpiry < 300) {
              console.log('🔄 Token expiring soon, refreshing...');
              get().refreshToken();
            } else {
              console.log('✅ Token still valid, no refresh needed');
            }
          }
        } catch (error) {
          console.error('❌ Token decode error:', error);
          get().logout();
        }
      },

      startAutoRefresh: () => {
        console.log('🔄 Starting auto refresh token...');
        // Clear any existing interval
        if (refreshInterval) {
          console.log('🔄 Clearing existing refresh interval');
          clearInterval(refreshInterval);
        }

        // Kiểm tra token ngay lập tức
        get().checkTokenExpiry();

        // Set up new interval - kiểm tra mỗi 5 phút
        refreshInterval = setInterval(() => {
          const { isAuthenticated, isRefreshing } = get();
          
          if (!isAuthenticated) {
            console.log('⚠️ Not authenticated, stopping auto refresh');
            get().stopAutoRefresh();
            return;
          }

          if (isRefreshing) {
            console.log('⚠️ Already refreshing, skipping');
            return;
          }

          get().checkTokenExpiry();
        }, 300000); // 5 minutes

        console.log('🔄 Auto refresh interval set for 5 minutes');
      },

      stopAutoRefresh: () => {
        console.log('🛑 Stopping auto refresh token...');
        if (refreshInterval) {
          clearInterval(refreshInterval);
          refreshInterval = null;
          console.log('🛑 Auto refresh stopped');
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          console.log('🔑 Starting login process...');
          
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          console.log('🔑 Login response:', {
            status: response.status,
            ok: response.ok
          });

          if (!response.ok) {
            throw new Error(data.error || 'Đăng nhập thất bại');
          }

          console.log('🔑 Updating auth state...');
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Start auto refresh after successful login
          console.log('🔑 Starting auto refresh...');
          get().startAutoRefresh();

        } catch (error) {
          console.error('❌ Login failed:', error);
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
            credentials: 'include',
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

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Start auto refresh after successful registration
          get().startAutoRefresh();

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            isLoading: false,
          });
          throw error;
        }
      },

      refreshToken: async () => {
        // Nếu đang refresh, trả về promise hiện tại
        if (refreshPromise) {
          console.log('🔄 Refresh already in progress, waiting...');
          return refreshPromise;
        }

        const { isRefreshing } = get();
        if (isRefreshing) {
          console.log('🔄 Already refreshing, skipping');
          return false;
        }

        refreshPromise = (async () => {
          try {
            console.log('🔄 Starting token refresh request...');
            set({ isRefreshing: true });

            // Debug: Log current refresh token from cookie
            const cookies = document.cookie.split(';');
            const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
            console.log('🔍 Current refresh token:', refreshTokenCookie ? refreshTokenCookie.split('=')[1] : 'Not found');

            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include',
            });

            const data = await response.json();
            console.log('🔄 Refresh response:', {
              status: response.status,
              ok: response.ok,
              data: data
            });

            if (!response.ok) {
              console.error('❌ Refresh token failed:', data.error);
              if (response.status === 401) {
                console.log('🔒 Unauthorized, logging out...');
                get().logout();
              }
              return false;
            }

            console.log('🔄 Updating auth state...');
            set({
              user: data.user,
              accessToken: data.accessToken,
              isAuthenticated: true,
              isRefreshing: false
            });

            console.log('✅ Token refresh completed successfully');
            return true;
          } catch (error) {
            console.error('❌ Token refresh failed:', error);
            get().logout();
            return false;
          } finally {
            set({ isRefreshing: false });
            refreshPromise = null;
          }
        })();

        return refreshPromise;
      },

      logout: () => {
        console.log('🚪 Starting logout process...');
        // Stop auto refresh
        get().stopAutoRefresh();
        
        // Call logout API endpoint
        fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        }).catch(error => {
          console.error('Logout API error:', error);
        });
        
        // Remove cookies (fallback)
        console.log('🧹 Removing cookies...');
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        
        console.log('🔄 Clearing auth state...');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          isRefreshing: false,
        });
        console.log('✅ Logout completed');
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