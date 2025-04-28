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
      // DEVELOPMENT MODE: Bỏ qua kiểm tra xác thực
      console.log("withAdminAuth - DEVELOPMENT MODE: Authentication bypassed");

      /* PRODUCTION MODE: Uncomment code below when ready for production
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!isAdmin()) {
        router.push('/');
      }
      */
    }, [isAuthenticated, router, isAdmin]);

    // DEVELOPMENT MODE: Luôn render component bất kể trạng thái xác thực
    return <WrappedComponent {...props} />;

    /* PRODUCTION MODE: Uncomment code below when ready for production
    // Nếu không phải admin, không render component
    if (!isAdmin()) {
      return null;
    }

    return <WrappedComponent {...props} />;
    */
  };
}