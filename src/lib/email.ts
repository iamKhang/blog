import { Resend } from 'resend'

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
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .otp-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: 8px;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .otp-label {
          color: #e5e7eb;
          font-size: 14px;
          margin-top: 10px;
        }
        .content {
          font-size: 16px;
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 25px;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .warning-text {
          color: #92400e;
          font-size: 14px;
          margin: 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background-color: #1e40af;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .highlight {
          color: #1e40af;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📝 Blog Platform</div>
          <h1 class="title">Xác thực tài khoản</h1>
        </div>
        
        <div class="content">
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu tạo tài khoản mới với email <span class="highlight">${email}</span>.</p>
          <p>Vui lòng sử dụng mã OTP bên dưới để xác thực tài khoản của bạn:</p>
        </div>
        
        <div class="otp-container">
          <p class="otp-code">${otp}</p>
          <p class="otp-label">Mã xác thực OTP</p>
        </div>
        
        <div class="content">
          <p>Mã OTP này sẽ <strong>hết hạn sau 5 phút</strong>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        </div>
        
        <div class="warning">
          <p class="warning-text">
            <strong>⚠️ Lưu ý bảo mật:</strong> Không chia sẻ mã OTP này với bất kỳ ai. Chúng tôi sẽ không bao giờ yêu cầu bạn cung cấp mã OTP qua điện thoại hoặc email.
          </p>
        </div>
        
        <div class="footer">
          <p>Nếu bạn gặp khó khăn, vui lòng liên hệ với chúng tôi.</p>
          <p>© 2024 Blog Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Gửi email OTP
export const sendOTPEmail = async (email: string, otp: string): Promise<{
  success: boolean
  message: string
  messageId?: string
}> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    const htmlContent = createOTPEmailTemplate(otp, email)
    
    const { data, error } = await resend.emails.send({
      from: 'lehoangkhang@iamhoangkhang.id.vn', // Thay đổi domain theo cấu hình của bạn
      to: [email],
      subject: `Mã xác thực OTP: ${otp} - Blog Platform`,
      html: htmlContent,
      text: `Mã xác thực OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        success: false,
        message: 'Không thể gửi email. Vui lòng thử lại sau.'
      }
    }

    console.log('OTP email sent successfully:', data?.id)
    return {
      success: true,
      message: 'Email OTP đã được gửi thành công',
      messageId: data?.id
    }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.'
    }
  }
}

// Template cho email chào mừng sau khi đăng ký thành công
export const sendWelcomeEmail = async (email: string, name: string): Promise<{
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
        <title>Chào mừng đến với Blog Platform</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          .welcome-banner {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
          }
          .content {
            font-size: 16px;
            line-height: 1.8;
            color: #4b5563;
          }
          .button {
            display: inline-block;
            background-color: #1e40af;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">📝 Blog Platform</div>
          </div>
          
          <div class="welcome-banner">
            <h1>🎉 Chào mừng ${name}!</h1>
            <p>Tài khoản của bạn đã được tạo thành công</p>
          </div>
          
          <div class="content">
            <p>Xin chào ${name},</p>
            <p>Chúc mừng bạn đã tham gia cộng đồng Blog Platform! Tài khoản của bạn đã được xác thực và sẵn sàng sử dụng.</p>
            <p>Bạn có thể bắt đầu khám phá các bài viết thú vị và chia sẻ những câu chuyện của riêng mình.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">
                Khám phá ngay
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Cảm ơn bạn đã tham gia Blog Platform!</p>
            <p>© 2024 Blog Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'lehoangkhang@iamhoangkhang.id.vn',
      to: [email],
      subject: `Chào mừng ${name} đến với Blog Platform! 🎉`,
      html: welcomeTemplate,
      text: `Chào mừng ${name} đến với Blog Platform! Tài khoản của bạn đã được tạo thành công.`
    })

    if (error) {
      console.error('Welcome email error:', error)
      return {
        success: false,
        message: 'Không thể gửi email chào mừng'
      }
    }

    return {
      success: true,
      message: 'Email chào mừng đã được gửi'
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra khi gửi email chào mừng'
    }
  }
}
