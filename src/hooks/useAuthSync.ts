import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthSync() {
  const { isAuthenticated, startAutoRefresh, stopAutoRefresh } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 User authenticated, starting auto refresh');
      startAutoRefresh();
    } else {
      console.log('🛑 User not authenticated, stopping auto refresh');
      stopAutoRefresh();
    }

    // Cleanup khi component unmount hoặc authentication state thay đổi
    return () => {
      if (!isAuthenticated) {
        stopAutoRefresh();
      }
    };
  }, [isAuthenticated, startAutoRefresh, stopAutoRefresh]);
} 