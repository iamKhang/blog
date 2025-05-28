import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs"; // npm install bcryptjs
import { generateTokens } from "@/lib/jwt";

// Schema validation cho request body
const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  bio: z.string().optional(),
  dob: z.string().optional(), // Nhận dạng ISO date string
  avatar: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    console.log("Password hashed successfully");

    // Tạo user mới
    console.log("Creating new user...");
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        bio: validatedData.bio,
        dob: validatedData.dob ? new Date(validatedData.dob) : null,
        avatar: validatedData.avatar,
      },
    });
    console.log("User created successfully");

    // Tạo tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Tạo session mới
    console.log("Creating new session...");
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isValid: true,
      },
    });
    console.log("Session created successfully");

    // Loại bỏ password trước khi trả về response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Đăng ký thành công",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi đăng ký" },
      { status: 500 }
    );
  }
} 