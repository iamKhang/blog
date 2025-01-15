import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokens } from "@/lib/jwt";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    // Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Tạo tokens mới
    const { accessToken, refreshToken } = generateTokens(user);

    // Lưu session mới
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
        accessToken,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        }
      }
    );

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 