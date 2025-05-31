import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, generateTokens } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Refresh token request received');
    
    // Lấy refresh token từ cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;
    console.log('🔄 Refresh token from cookie:', refreshToken ? 'Present' : 'Missing');

    if (!refreshToken) {
      console.error("No refresh token found in cookies");
      return NextResponse.json(
        { error: "Không tìm thấy refresh token" },
        { status: 401 }
      );
    }

    // Verify refresh token
    console.log('🔄 Verifying refresh token...');
    const decoded = verifyRefreshToken(refreshToken);
    console.log('🔄 Token verification result:', decoded ? 'Valid' : 'Invalid');
    
    if (!decoded) {
      console.error("Invalid refresh token");
      return NextResponse.json(
        { error: "Refresh token không hợp lệ" },
        { status: 401 }
      );
    }

    // Debug: Check all sessions for this user
    console.log('🔄 Checking sessions for user:', decoded.id);
    const allUserSessions = await prisma.session.findMany({
      where: { userId: decoded.id },
      select: { id: true, refreshToken: true, isValid: true, expiresAt: true, createdAt: true }
    });
    console.log('🔄 All user sessions:', allUserSessions.length);
    
    // Tìm session hợp lệ với transaction để tránh race condition
    const result = await prisma.$transaction(async (tx) => {
      // Tìm session với refresh token này
      const session = await tx.session.findFirst({
        where: {
          refreshToken,
          isValid: true,
        },
        include: {
          user: true
        }
      });

      if (!session) {
        console.error("No valid session found for refresh token");
        console.log('🔄 Current time:', new Date().toISOString());
        
        // Debug: Find any session with this refresh token
        const anySession = await tx.session.findFirst({
          where: { refreshToken },
          select: { id: true, isValid: true, expiresAt: true, createdAt: true }
        });
        console.log('🔄 Any session with this token:', anySession);
        
        // Vô hiệu hóa tất cả session có refresh token này
        await tx.session.updateMany({
          where: { refreshToken },
          data: { isValid: false },
        });
        return null;
      }

      // Kiểm tra thời gian hết hạn
      const now = new Date();
      if (session.expiresAt < now) {
        console.error("Session expired");
        await tx.session.update({
          where: { id: session.id },
          data: { isValid: false }
        });
        return null;
      }

      console.log('🔄 Found valid session:', session.id);

      // Tạo tokens mới
      const tokens = generateTokens(session.user);
      console.log('🔄 Generated new tokens');

      // Cập nhật session hiện tại với refresh token mới
      const updatedSession = await tx.session.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
          updatedAt: new Date()
        },
      });

      console.log('🔄 Updated session:', updatedSession.id);

      return {
        user: session.user,
        tokens,
        session: updatedSession
      };
    });

    if (!result) {
      return NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = result.user as { password: string; [key: string]: any };

    const response = NextResponse.json(
      {
        message: "Làm mới token thành công",
        user: userWithoutPassword,
        accessToken: result.tokens.accessToken,
      }
    );

    // Set refresh token cookie với cấu hình đầy đủ
    response.cookies.set({
      name: 'refreshToken',
      value: result.tokens.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined
    });

    // Set access token cookie
    response.cookies.set({
      name: 'accessToken',
      value: result.tokens.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined
    });

    console.log("✅ Token refresh successful for user:", result.user.id);
    return response;

  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi làm mới token" },
      { status: 500 }
    );
  }
} 