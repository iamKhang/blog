import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number;
  role?: string;
  email: string;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')

  // Check if route is admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Nếu không có access token nhưng có refresh token, thử refresh
  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Cookie': `refreshToken=${refreshToken.value}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const res = NextResponse.next()
        
        // Set new access token
        res.cookies.set({
          name: 'accessToken',
          value: data.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60, // 15 minutes
        })

        return res
      } else {
        // Nếu refresh thất bại, xóa cookies và chuyển về trang login
        const res = NextResponse.redirect(new URL('/login', request.url))
        res.cookies.delete('accessToken')
        res.cookies.delete('refreshToken')
        return res
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Xóa cookies và chuyển về trang login
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('accessToken')
      res.cookies.delete('refreshToken')
      return res
    }
  }

  // Nếu có access token, kiểm tra hết hạn và quyền
  if (accessToken) {
    try {
      const decoded = jwtDecode<JWTPayload>(accessToken.value)
      const currentTime = Math.floor(Date.now() / 1000)

      // Nếu token sắp hết hạn (còn 5 phút) và có refresh token, thử refresh
      if (decoded.exp && decoded.exp - currentTime < 300 && refreshToken) {
        try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Cookie': `refreshToken=${refreshToken.value}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const res = NextResponse.next()
          
          res.cookies.set({
            name: 'accessToken',
            value: data.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
          })

          return res
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
        }
      }

      // Kiểm tra quyền admin cho các route admin
      if (isAdminRoute && decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      // Xóa cookies và chuyển về trang login
      const res = NextResponse.redirect(new URL('/login', request.url))
      res.cookies.delete('accessToken')
      res.cookies.delete('refreshToken')
      return res
    }
  } else if (isAdminRoute) {
    // Nếu là route admin và không có token, chuyển về trang login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (public routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
}