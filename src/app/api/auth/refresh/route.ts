import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, generateTokens } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Không tìm thấy refresh token" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Refresh token không hợp lệ" },
        { status: 401 }
      );
    }

    // Tìm session hợp lệ
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        isValid: true,
        expiresAt: {
          gt: new Date() // Chỉ lấy session chưa hết hạn
        }
      },
    });

    if (!session) {
      // Vô hiệu hóa tất cả session có refresh token này
      await prisma.session.updateMany({
        where: { refreshToken },
        data: { isValid: false },
      });

      return NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ" },
        { status: 401 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 401 }
      );
    }

    // Tạo tokens mới
    const tokens = generateTokens(user);

    // Vô hiệu hóa session cũ
    await prisma.session.update({
      where: { id: session.id },
      data: { isValid: false },
    });

    // Tạo session mới với thời gian hết hạn
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Hết hạn sau 7 ngày

    await prisma.session.create({
      data: {
        userId: session.userId,
        refreshToken: tokens.refreshToken,
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        isValid: true,
        expiresAt,
      },
    });

    const { password: _, ...userWithoutPassword } = user as { password: string; [key: string]: any };

    return NextResponse.json(
      {
        message: "Làm mới token thành công",
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
      },
      {
        headers: {
          'Set-Cookie': `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`
        }
      }
    );

  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi làm mới token" },
      { status: 500 }
    );
  }
} 