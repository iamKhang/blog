import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Xóa tất cả session hết hạn
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // Session đã hết hạn
          { isValid: false }, // Session đã bị vô hiệu hóa
        ],
      },
    });

    return NextResponse.json({
      message: "Cleanup completed",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup sessions" },
      { status: 500 }
    );
  }
} 