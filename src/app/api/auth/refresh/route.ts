import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, generateTokens } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Tìm session hợp lệ
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        isValid: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    // Tạo tokens mới
    const tokens = generateTokens(user);

    // Cập nhật session với refresh token mới
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return NextResponse.json(
      {
        message: "Token refreshed successfully",
        accessToken: tokens.accessToken,
      },
      {
        headers: {
          'Set-Cookie': `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        }
      }
    );

  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 