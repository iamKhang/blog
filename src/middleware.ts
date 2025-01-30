import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  role?: string;
}

export async function middleware(request: NextRequest) {
  console.log("middleware");
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Lấy access token từ cookie
      const accessToken = request.cookies.get("accessToken")?.value;
      
      if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Decode token với kiểu được chỉ định
      const decoded = jwtDecode<JWTPayload>(accessToken);
      console.log('decoded token:', decoded);
      // Kiểm tra role từ payload
      if (decoded?.role !== 'ADMIN') {
        console.log('User role:', decoded?.role);
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Nếu là ADMIN, cho phép tiếp tục
      return NextResponse.next();

    } catch (error) {
      console.log('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Cho phép các route khác đi qua
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route /admin
export const config = {
  matcher: '/admin/:path*',
}; 