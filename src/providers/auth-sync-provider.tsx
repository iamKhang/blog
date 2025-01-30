"use client";

import { useEffect, useState } from 'react';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useAuthSync();

  // Đợi hydration hoàn tất trước khi render children
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
} 