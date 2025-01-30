"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuthComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isAdmin } = useAuthStore();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!isAdmin()) {
        router.push('/');
      }
    }, [isAuthenticated, router]);

    // Nếu không phải admin, không render component
    if (!isAdmin()) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 