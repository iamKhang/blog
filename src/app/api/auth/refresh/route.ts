import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, generateTokens } from "@/lib/jwt";

export async function POST(request: Request) {
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
      },
      include: {
        user: true,
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

    // Tạo tokens mới
    const tokens = generateTokens(session.user);

    // Vô hiệu hóa session cũ
    await prisma.session.update({
      where: { id: session.id },
      data: { isValid: false },
    });

    // Tạo session mới
    await prisma.session.create({
      data: {
        userId: session.userId,
        refreshToken: tokens.refreshToken,
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        isValid: true,
      },
    });

    const { password: _, ...userWithoutPassword } = session.user;

    return NextResponse.json(
      {
        message: "Làm mới token thành công",
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
      },
      {
        headers: {
          'Set-Cookie': `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`
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