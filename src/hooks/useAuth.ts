import { useAuthStore } from '@/store/useAuthStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Danh sách các route công khai không cần xác thực
const publicRoutes = ['/login', '/register']

export const useAuth = () => {
  const router = useRouter()
  const pathname = usePathname()
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    isAdmin,
  } = useAuthStore()

  // Chỉ chuyển hướng nếu không phải route công khai
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router, pathname])

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    isAdmin,
  }
} 