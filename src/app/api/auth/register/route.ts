import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs"; // npm install bcryptjs
import { generateTokens } from "@/lib/jwt";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // Tạo tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Lưu session với refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      },
    });

    // Không trả về password trong response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Registration successful",
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        }
      }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);
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