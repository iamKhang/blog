import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Delete expired sessions
    await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isValid: false }
        ]
      }
    });

    return NextResponse.json({ message: "Cleanup completed successfully" });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup sessions" },
      { status: 500 }
    );
  }
} 