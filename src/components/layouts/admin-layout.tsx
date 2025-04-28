"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Đợi hydration hoàn tất
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Đánh dấu đã hydrate
    setIsHydrated(true);

    // DEVELOPMENT MODE: Bỏ qua kiểm tra xác thực
    console.log("AdminLayout - DEVELOPMENT MODE: Authentication bypassed");

    /* PRODUCTION MODE: Uncomment code below when ready for production
    // Chỉ kiểm tra sau khi đã hydrate
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isAdmin()) {
      router.push('/');
    }
    */
  }, [isAuthenticated, router, isAdmin, isHydrated]);

  // Không render gì cho đến khi hydrate xong
  if (!isHydrated) {
    return null;
  }

  // DEVELOPMENT MODE: Luôn render layout bất kể trạng thái xác thực
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );

  /* PRODUCTION MODE: Uncomment code below when ready for production
  // Nếu đã hydrate và có quyền admin thì render layout
  if (isAuthenticated && isAdmin()) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    );
  }

  // Trong quá trình chuyển hướng, không render gì
  return null;
  */
}