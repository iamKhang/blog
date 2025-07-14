import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { generateOTP, saveOTP, hasActiveOTP } from "@/lib/otp"
import { sendOTPEmail } from "@/lib/email"

// Schema validation cho request body
const sendOTPSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = sendOTPSchema.parse(body)
    const { email } = validatedData

    // Kiểm tra email đã được đăng ký chưa
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng để đăng ký tài khoản" },
        { status: 400 }
      )
    }

    // Kiểm tra xem email đã có OTP active chưa
    const { hasOTP, remainingTime } = await hasActiveOTP(email)
    
    if (hasOTP && remainingTime && remainingTime > 0) {
      return NextResponse.json(
        { 
          error: "OTP đã được gửi trước đó. Vui lòng đợi hết thời gian hiệu lực hoặc sử dụng OTP đã gửi.",
          remainingTime 
        },
        { status: 429 } // Too Many Requests
      )
    }

    // Generate OTP mới
    const otp = generateOTP()
    console.log(`Generated OTP for ${email}: ${otp}`) // Log để debug (xóa trong production)

    // Lưu OTP vào Redis
    await saveOTP(email, otp)

    // Gửi email OTP
    const emailResult = await sendOTPEmail(email, otp)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.",
      expiresIn: 300, // 5 minutes in seconds
      messageId: emailResult.messageId
    })

  } catch (error) {
    console.error("SEND OTP ERROR:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại sau." },
      { status: 500 }
    )
  }
}

// GET method để kiểm tra trạng thái OTP
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailSchema = z.string().email()
    const validatedEmail = emailSchema.parse(email)

    // Kiểm tra trạng thái OTP
    const { hasOTP, remainingTime } = await hasActiveOTP(validatedEmail)

    return NextResponse.json({
      hasActiveOTP: hasOTP,
      remainingTime: remainingTime || 0,
      canRequestNew: !hasOTP || (remainingTime && remainingTime <= 0)
    })

  } catch (error) {
    console.error("CHECK OTP STATUS ERROR:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra khi kiểm tra trạng thái OTP" },
      { status: 500 }
    )
  }
}
