import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Chỉ cho phép trong development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: "Debug route not available in production" },
        { status: 403 }
      );
    }

    // Xóa tất cả sessions không hợp lệ hoặc hết hạn
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { isValid: false },
          { expiresAt: { lt: new Date() } }
        ]
      }
    });

    console.log(`🧹 Cleaned up ${result.count} invalid/expired sessions`);

    return NextResponse.json({
      message: "Sessions cleaned up successfully",
      deletedCount: result.count
    });

  } catch (error) {
    console.error("CLEANUP SESSIONS ERROR:", error);
    return NextResponse.json(
      { error: "Cleanup error" },
      { status: 500 }
    );
  }
} 