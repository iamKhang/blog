import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyOTP } from "@/lib/otp"
import jwt from "jsonwebtoken"

// Schema validation cho request body
const verifyOTPSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  otp: z.string().min(4, "OTP phải có 4 chữ số").max(4, "OTP phải có 4 chữ số"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = verifyOTPSchema.parse(body)
    const { email, otp } = validatedData

    console.log(`Verifying OTP for email: ${email}, OTP: ${otp}`)

    // Verify OTP
    const verificationResult = await verifyOTP(email, otp)

    if (!verificationResult.success) {
      return NextResponse.json(
        { 
          error: verificationResult.message,
          remainingTime: verificationResult.remainingTime 
        },
        { status: 400 }
      )
    }

    // OTP verified successfully - tạo temporary token để user có thể tiếp tục đăng ký
    const tempToken = jwt.sign(
      { 
        email,
        verified: true,
        purpose: 'registration',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET!,
      { expiresIn: '10m' } // Token tạm thời có hiệu lực 10 phút
    )

    console.log(`OTP verified successfully for email: ${email}`)

    return NextResponse.json({
      message: "OTP xác thực thành công",
      tempToken,
      email,
      verified: true
    })

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại sau." },
      { status: 500 }
    )
  }
}

// GET method để kiểm tra trạng thái verification token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string
      verified: boolean
      purpose: string
      timestamp: number
    }

    // Kiểm tra token có phải cho registration không
    if (decoded.purpose !== 'registration' || !decoded.verified) {
      return NextResponse.json(
        { error: "Invalid token purpose" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: decoded.email,
      verified: decoded.verified,
      timestamp: decoded.timestamp
    })

  } catch (error) {
    console.error("TOKEN VERIFICATION ERROR:", error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xác thực token" },
      { status: 500 }
    )
  }
}
