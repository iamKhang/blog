import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

export function useAuthSync() {
  const { accessToken, refreshToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      // Nếu token sắp hết hạn (ví dụ: còn 1 phút), thực hiện refresh
      if (decoded.exp && decoded.exp - currentTime < 60) {
        useAuthStore.getState().refreshToken();
      }
    } catch (error) {
      console.error('Token decode error:', error);
    }
  }, [accessToken, isAuthenticated]);
} 