import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

export function useAuthSync() {
  const { accessToken, isAuthenticated, refreshToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      // Nếu token sắp hết hạn (còn 5 phút), thực hiện refresh
      if (decoded.exp && decoded.exp - currentTime < 300) {
        const refreshWithRetry = async (retries = 3) => {
          try {
            await refreshToken();
          } catch (error) {
            console.error('Token refresh failed:', error);
            if (retries > 0) {
              // Retry after 1 second
              setTimeout(() => refreshWithRetry(retries - 1), 1000);
            }
          }
        };
        
        refreshWithRetry();
      }
    } catch (error) {
      console.error('Token decode error:', error);
    }
  }, [accessToken, isAuthenticated, refreshToken]);
} 