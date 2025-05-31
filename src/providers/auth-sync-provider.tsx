"use client";

import { useEffect, useState } from 'react';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Chỉ init nếu chưa authenticated trong store nhưng có thể có cookies
        if (!isAuthenticated && !user) {
          console.log('🔍 Checking for existing auth session...');
          
          const response = await fetch('/api/auth/init', {
            method: 'GET',
            credentials: 'include',
          });

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