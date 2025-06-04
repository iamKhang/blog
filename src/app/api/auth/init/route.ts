import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;
    console.log('🔍 Init: Refresh token from cookie:', refreshToken ? 'Present' : 'Missing');

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      console.error("Invalid refresh token during init");
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Tìm session và user
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        isValid: true,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!session) {
      console.error("No valid session found during init");
      return NextResponse.json(
        { error: "No valid session" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = session.user as any;

    return NextResponse.json({
      message: "Authentication state initialized",
      user: userWithoutPassword,
      isAuthenticated: true
    });

  } catch (error) {
    console.error("INIT AUTH ERROR:", error);
    return NextResponse.json(
      { error: "Init error" },
      { status: 500 }
    );
  }
} 