import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Chỉ cho phép trong development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: "Debug route not available in production" },
        { status: 403 }
      );
    }

    // Lấy refresh token từ cookie để debug
    const refreshToken = request.cookies.get("refreshToken")?.value;
    console.log("🔍 Debug: Refresh token from cookie:", refreshToken ? "Present" : "Missing");

    // Lấy tất cả sessions
    const allSessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        refreshToken: true,
        isValid: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Thống kê sessions
    const stats = {
      total: allSessions.length,
      valid: allSessions.filter(s => s.isValid).length,
      expired: allSessions.filter(s => s.expiresAt < new Date()).length,
      current: refreshToken ? allSessions.filter(s => s.refreshToken === refreshToken).length : 0
    };

    return NextResponse.json({
      currentTime: new Date().toISOString(),
      refreshTokenFromCookie: refreshToken ? "Present" : "Missing",
      stats,
      sessions: allSessions.map(session => ({
        ...session,
        refreshToken: session.refreshToken ? `${session.refreshToken.substring(0, 10)}...` : null,
        isExpired: session.expiresAt < new Date(),
        timeToExpiry: session.expiresAt.getTime() - Date.now()
      }))
    });

  } catch (error) {
    console.error("DEBUG SESSIONS ERROR:", error);
    return NextResponse.json(
      { error: "Debug error" },
      { status: 500 }
    );
  }
} 