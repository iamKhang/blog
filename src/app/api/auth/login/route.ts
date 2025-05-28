import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokens } from "@/lib/jwt";

const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    // Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    console.log("Found user:", user ? "Yes" : "No");
    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    // Verify password
    console.log("Comparing passwords...");
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    // Tạo tokens mới
    const { accessToken, refreshToken } = generateTokens(user);

    // Vô hiệu hóa tất cả session cũ của user này
    await prisma.session.updateMany({
      where: {
        userId: user.id,
        isValid: true,
      },
      data: {
        isValid: false,
      },
    });

    // Tạo session mới
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        isValid: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    // Set cả access token và refresh token vào cookie
    const response = NextResponse.json(
      {
        message: "Đăng nhập thành công",
        user: userWithoutPassword,
        accessToken,
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi đăng nhập" },
      { status: 500 }
    );
  }
} 