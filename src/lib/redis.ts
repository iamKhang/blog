import { createClient } from 'redis'

// Tạo Redis client với cấu hình phù hợp cho cả local và production
const createRedisClient = () => {
  // Trong môi trường development, sử dụng Redis local
  if (process.env.NODE_ENV === 'development') {
    return createClient({
      url: 'redis://localhost:6379'
    })
  }
  
  // Trong môi trường production (Vercel), sử dụng Redis Database từ Storage
  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is not set')
  }
  
  return createClient({
    url: redisUrl
  })
}

// Tạo singleton Redis client
let redisClient: ReturnType<typeof createClient> | null = null

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createRedisClient()
    
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
    
    redisClient.on('connect', () => {
      console.log('Redis Client Connected')
    })
    
    redisClient.on('ready', () => {
      console.log('Redis Client Ready')
    })
    
    redisClient.on('end', () => {
      console.log('Redis Client Disconnected')
    })
  }
  
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  
  return redisClient
}

// Utility function để đóng kết nối Redis (sử dụng khi cần thiết)
export const closeRedisConnection = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit()
    redisClient = null
  }
}

// Helper functions cho OTP operations
export const redisOTP = {
  // Lưu OTP với thời gian hết hạn (5 phút)
  async setOTP(email: string, otp: string): Promise<void> {
    const client = await getRedisClient()
    const key = `otp:${email}`
    await client.setEx(key, 300, otp) // 300 seconds = 5 minutes
  },
  
  // Lấy OTP từ Redis
  async getOTP(email: string): Promise<string | null> {
    const client = await getRedisClient()
    const key = `otp:${email}`
    return await client.get(key)
  },
  
  // Xóa OTP sau khi verify thành công
  async deleteOTP(email: string): Promise<void> {
    const client = await getRedisClient()
    const key = `otp:${email}`
    await client.del(key)
  },
  
  // Kiểm tra xem OTP có tồn tại không
  async hasOTP(email: string): Promise<boolean> {
    const client = await getRedisClient()
    const key = `otp:${email}`
    const exists = await client.exists(key)
    return exists === 1
  },
  
  // Lấy thời gian còn lại của OTP (tính bằng giây)
  async getOTPTTL(email: string): Promise<number> {
    const client = await getRedisClient()
    const key = `otp:${email}`
    return await client.ttl(key)
  }
}
