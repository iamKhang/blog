import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      // Vô hiệu hóa tất cả session có refresh token này
      await prisma.session.updateMany({
        where: { refreshToken },
        data: { isValid: false },
      });
    }

    const response = NextResponse.json(
      { message: "Đăng xuất thành công" },
      { status: 200 }
    );

    // Xóa cookies
    response.cookies.set({
      name: 'accessToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set({
      name: 'refreshToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    console.log("Logout successful");
    return response;

  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi đăng xuất" },
      { status: 500 }
    );
  }
} 