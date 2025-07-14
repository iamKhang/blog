import { redisOTP } from './redis'

// Generate OTP 4 số ngẫu nhiên
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Validate OTP format (4 số)
export const isValidOTPFormat = (otp: string): boolean => {
  return /^\d{4}$/.test(otp)
}

// Lưu OTP vào Redis với thời gian hết hạn 5 phút
export const saveOTP = async (email: string, otp: string): Promise<void> => {
  try {
    await redisOTP.setOTP(email, otp)
    console.log(`OTP saved for email: ${email}`)
  } catch (error) {
    console.error('Error saving OTP:', error)
    throw new Error('Failed to save OTP')
  }
}

// Verify OTP
export const verifyOTP = async (email: string, inputOTP: string): Promise<{
  success: boolean
  message: string
  remainingTime?: number
}> => {
  try {
    // Kiểm tra format OTP
    if (!isValidOTPFormat(inputOTP)) {
      return {
        success: false,
        message: 'OTP phải là 4 chữ số'
      }
    }

    // Lấy OTP từ Redis
    const storedOTP = await redisOTP.getOTP(email)
    
    if (!storedOTP) {
      return {
        success: false,
        message: 'OTP đã hết hạn hoặc không tồn tại'
      }
    }

    // So sánh OTP
    if (storedOTP !== inputOTP) {
      // Lấy thời gian còn lại để hiển thị cho user
      const remainingTime = await redisOTP.getOTPTTL(email)
      return {
        success: false,
        message: 'OTP không chính xác',
        remainingTime: remainingTime > 0 ? remainingTime : 0
      }
    }

    // OTP đúng - xóa khỏi Redis
    await redisOTP.deleteOTP(email)
    
    return {
      success: true,
      message: 'OTP xác thực thành công'
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra khi xác thực OTP'
    }
  }
}

// Kiểm tra xem email đã có OTP chưa
export const hasActiveOTP = async (email: string): Promise<{
  hasOTP: boolean
  remainingTime?: number
}> => {
  try {
    const hasOTP = await redisOTP.hasOTP(email)
    
    if (hasOTP) {
      const remainingTime = await redisOTP.getOTPTTL(email)
      return {
        hasOTP: true,
        remainingTime: remainingTime > 0 ? remainingTime : 0
      }
    }
    
    return { hasOTP: false }
  } catch (error) {
    console.error('Error checking active OTP:', error)
    return { hasOTP: false }
  }
}

// Xóa OTP (sử dụng khi cần reset)
export const deleteOTP = async (email: string): Promise<void> => {
  try {
    await redisOTP.deleteOTP(email)
    console.log(`OTP deleted for email: ${email}`)
  } catch (error) {
    console.error('Error deleting OTP:', error)
    throw new Error('Failed to delete OTP')
  }
}

// Format thời gian còn lại thành mm:ss
export const formatRemainingTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
