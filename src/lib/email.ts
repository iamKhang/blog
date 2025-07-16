import { Resend } from "resend"

// Khởi tạo Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Template HTML cho email OTP
const createOTPEmailTemplate = (otp: string, email: string) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã xác thực OTP</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
          background: linear-gradient(135deg, #EC8305 0%, #F59E0B 50%, #FBBF24 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        .header {
          background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(236, 131, 5, 0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .logo-container {
          position: relative;
          z-index: 2;
          display: inline-block;
          background: linear-gradient(135deg, #EC8305 0%, #F59E0B 100%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(236, 131, 5, 0.3);
        }
        .logo {
          font-size: 32px;
          color: white;
        }
        .header-title {
          position: relative;
          z-index: 2;
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .header-subtitle {
          position: relative;
          z-index: 2;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #1F2937;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .description {
          font-size: 16px;
          color: #6B7280;
          line-height: 1.7;
          margin-bottom: 30px;
        }
        .email-highlight {
          color: #1E40AF;
          font-weight: 600;
          background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
          padding: 2px 8px;
          border-radius: 6px;
        }
        .otp-section {
          background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
          margin: 30px 0;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .otp-section::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #EC8305, #F59E0B, #FBBF24, #EC8305);
          border-radius: 18px;
          z-index: -1;
          animation: borderGlow 3s linear infinite;
        }
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .otp-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .otp-code {
          font-size: 48px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 12px;
          margin: 20px 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          font-family: 'Courier New', monospace;
          background: linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .otp-timer {
          color: #FEF3C7;
          font-size: 14px;
          font-weight: 500;
          background: rgba(236, 131, 5, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 10px;
        }
        .security-notice {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-left: 4px solid #F59E0B;
          padding: 20px;
          border-radius: 12px;
          margin: 30px 0;
          position: relative;
        }
        .security-notice::before {
          content: '🛡️';
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 20px;
        }
        .security-text {
          color: #92400E;
          font-size: 14px;
          line-height: 1.6;
          margin-left: 35px;
          font-weight: 500;
        }
        .footer {
          background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
          padding: 30px;
          text-align: center;
          border-top: 1px solid #E5E7EB;
        }
        .footer-text {
          color: #6B7280;
          font-size: 14px;
          line-height: 1.6;
        }
        .footer-brand {
          color: #1E40AF;
          font-weight: 600;
          margin-top: 10px;
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #EC8305 50%, transparent 100%);
          margin: 30px 0;
          border-radius: 1px;
        }
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 16px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .otp-code {
            font-size: 36px;
            letter-spacing: 8px;
          }
          .header-title {
            font-size: 28px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo-container">
            <div class="logo">🔐</div>
          </div>
          <h1 class="header-title">Xác thực tài khoản</h1>
          <p class="header-subtitle">Mã OTP bảo mật của bạn</p>
        </div>
        
        <div class="content">
          <div class="greeting">Xin chào! 👋</div>
          
          <div class="description">
            Bạn đã yêu cầu tạo tài khoản mới với email <span class="email-highlight">${email}</span>.
            <br><br>
            Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP bên dưới:
          </div>
          
          <div class="otp-section">
            <div class="otp-label">Mã xác thực OTP</div>
            <div class="otp-code">${otp}</div>
            <div class="otp-timer">⏰ Hết hạn sau 5 phút</div>
          </div>
          
          <div class="description">
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Mã OTP sẽ tự động hết hạn.
          </div>
          
          <div class="divider"></div>
          
          <div class="security-notice">
            <div class="security-text">
              <strong>Lưu ý bảo mật quan trọng:</strong><br>
              • Không chia sẻ mã OTP này với bất kỳ ai<br>
              • Chúng tôi sẽ không bao giờ yêu cầu mã OTP qua điện thoại<br>
              • Mã chỉ có hiệu lực trong 5 phút
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Nếu bạn gặp khó khăn, vui lòng liên hệ với chúng tôi qua email hỗ trợ.
          </div>
          <div class="footer-brand">
            © 2024 iamHoangKhang Blog Platform. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Gửi email OTP
export const sendOTPEmail = async (
  email: string,
  otp: string,
): Promise<{
  success: boolean
  message: string
  messageId?: string
}> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured")
    }

    const htmlContent = createOTPEmailTemplate(otp, email)

    const { data, error } = await resend.emails.send({
      from: "lehoangkhang@iamhoangkhang.id.vn",
      to: [email],
      subject: `🔐 Mã xác thực OTP: ${otp} - iamHoangKhang Blog`,
      html: htmlContent,
      text: `Mã xác thực OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`,
    })

    if (error) {
      console.error("Resend error:", error)
      return {
        success: false,
        message: "Không thể gửi email. Vui lòng thử lại sau.",
      }
    }

    console.log("OTP email sent successfully:", data?.id)
    return {
      success: true,
      message: "Email OTP đã được gửi thành công",
      messageId: data?.id,
    }
  } catch (error) {
    console.error("Error sending OTP email:", error)
    return {
      success: false,
      message: "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.",
    }
  }
}

// Template cho email chào mừng sau khi đăng ký thành công
export const sendWelcomeEmail = async (
  email: string,
  name: string,
): Promise<{
  success: boolean
  message: string
}> => {
  try {
    const welcomeTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng đến với iamHoangKhang Blog</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #EC8305 0%, #F59E0B 50%, #FBBF24 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(236, 131, 5, 0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          .logo-container {
            position: relative;
            z-index: 2;
            display: inline-block;
            background: linear-gradient(135deg, #EC8305 0%, #F59E0B 100%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(236, 131, 5, 0.3);
          }
          .logo {
            font-size: 32px;
            color: white;
          }
          .header-title {
            position: relative;
            z-index: 2;
            font-size: 32px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          .header-subtitle {
            position: relative;
            z-index: 2;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
          }
          .welcome-banner {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            margin: 30px;
            padding: 40px 30px;
            border-radius: 16px;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
          }
          .welcome-banner::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: sparkle 4s ease-in-out infinite;
          }
          @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
          }
          .welcome-title {
            position: relative;
            z-index: 2;
            font-size: 36px;
            font-weight: 800;
            color: white;
            margin-bottom: 15px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          .welcome-subtitle {
            position: relative;
            z-index: 2;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #1F2937;
            margin-bottom: 25px;
            font-weight: 500;
          }
          .description {
            font-size: 16px;
            color: #6B7280;
            line-height: 1.7;
            margin-bottom: 30px;
          }
          .name-highlight {
            color: #1E40AF;
            font-weight: 700;
            background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
            padding: 2px 8px;
            border-radius: 6px;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 30px rgba(30, 64, 175, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          .cta-button:hover::before {
            left: 100%;
          }
          .features {
            background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
          }
          .features-title {
            font-size: 20px;
            font-weight: 700;
            color: #1F2937;
            margin-bottom: 20px;
            text-align: center;
          }
          .feature-list {
            display: grid;
            gap: 15px;
          }
          .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #4B5563;
            font-size: 15px;
          }
          .feature-icon {
            background: linear-gradient(135deg, #EC8305 0%, #F59E0B 100%);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
          }
          .footer {
            background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
          }
          .footer-text {
            color: #6B7280;
            font-size: 14px;
            line-height: 1.6;
          }
          .footer-brand {
            color: #1E40AF;
            font-weight: 600;
            margin-top: 10px;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #EC8305 50%, transparent 100%);
            margin: 30px 0;
            border-radius: 1px;
          }
          @media (max-width: 600px) {
            .email-container {
              margin: 10px;
              border-radius: 16px;
            }
            .header, .content {
              padding: 30px 20px;
            }
            .welcome-banner {
              margin: 20px;
              padding: 30px 20px;
            }
            .welcome-title {
              font-size: 28px;
            }
            .header-title {
              font-size: 28px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo-container">
              <div class="logo">📝</div>
            </div>
            <h1 class="header-title">iamHoangKhang Blog</h1>
            <p class="header-subtitle">Nơi chia sẻ kiến thức và trải nghiệm</p>
          </div>
          
          <div class="welcome-banner">
            <h1 class="welcome-title">🎉 Chào mừng ${name}!</h1>
            <p class="welcome-subtitle">Tài khoản của bạn đã được tạo thành công</p>
          </div>
          
          <div class="content">
            <div class="greeting">Xin chào <span class="name-highlight">${name}</span>! 👋</div>
            
            <div class="description">
              Chúc mừng bạn đã tham gia cộng đồng <strong>iamHoangKhang Blog Platform</strong>! 
              Tài khoản của bạn đã được xác thực và sẵn sàng sử dụng.
            </div>
            
            <div class="description">
              Bạn có thể bắt đầu khám phá các bài viết thú vị về công nghệ, lập trình, 
              và chia sẻ những câu chuyện, kiến thức của riêng mình với cộng đồng.
            </div>
            
            <div class="cta-section">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://iamhoangkhang.id.vn/"}" class="cta-button">
                🚀 Khám phá ngay
              </a>
            </div>
            
            <div class="divider"></div>
            
            <div class="features">
              <h3 class="features-title">Những gì bạn có thể làm:</h3>
              <div class="feature-list">
                <div class="feature-item">
                  <div class="feature-icon">📖</div>
                  <span>Đọc và khám phá các bài viết chất lượng cao</span>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">✍️</div>
                  <span>Viết và chia sẻ bài viết của riêng bạn</span>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">💬</div>
                  <span>Tương tác và thảo luận với cộng đồng</span>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">🔖</div>
                  <span>Lưu và quản lý các bài viết yêu thích</span>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">👤</div>
                  <span>Tùy chỉnh hồ sơ cá nhân của bạn</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              Cảm ơn bạn đã tham gia cộng đồng của chúng tôi!<br>
              Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
            </div>
            <div class="footer-brand">
              © 2024 iamHoangKhang Blog Platform. All rights reserved.
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: "lehoangkhang@iamhoangkhang.id.vn",
      to: [email],
      subject: `🎉 Chào mừng ${name} đến với iamHoangKhang Blog!`,
      html: welcomeTemplate,
      text: `Chào mừng ${name} đến với iamHoangKhang Blog Platform! Tài khoản của bạn đã được tạo thành công.`,
    })

    if (error) {
      console.error("Welcome email error:", error)
      return {
        success: false,
        message: "Không thể gửi email chào mừng",
      }
    }

    return {
      success: true,
      message: "Email chào mừng đã được gửi",
    }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return {
      success: false,
      message: "Có lỗi xảy ra khi gửi email chào mừng",
    }
  }
}
