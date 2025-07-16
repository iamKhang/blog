"use client";

import { useEffect, useState } from 'react';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Nếu đã có auth state từ localStorage, không cần check server
        if (isAuthenticated && user) {
          console.log('✅ Auth state already available from localStorage');
          setIsHydrated(true);
          return;
        }

        // Chỉ check server nếu chưa có auth state
        console.log('🔍 Checking for existing auth session...');

        // Thêm timeout để tránh block quá lâu
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        try {
          const response = await fetch('/api/auth/init', {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Found existing session, restoring auth state');

            useAuthStore.setState({
              user: data.user,
              isAuthenticated: true,
              accessToken: null // Will be refreshed automatically
            });
          } else {
            console.log('❌ No valid session found');
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            console.log('⏰ Auth check timeout, proceeding without auth');
          } else {
            throw fetchError;
          }
        }
      } catch (error) {
        console.error('❌ Auth init error:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    initAuth();
  }, []); // Only run once on mount

  useAuthSync();

  // Đợi hydration hoàn tất trước khi render children
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}