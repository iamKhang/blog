import { PrismaClient } from '@prisma/client'

// Tạo Prisma Client với cấu hình phù hợp cho MongoDB với replica set
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    // Cấu hình transaction cho MongoDB với replica set
    transactionOptions: {
      maxWait: 5000, // 5 giây
      timeout: 10000, // 10 giây
    },
  })
}

// Sử dụng biến global để tránh tạo nhiều kết nối trong môi trường development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Sử dụng client đã tồn tại hoặc tạo mới
export const prisma = globalForPrisma.prisma || prismaClientSingleton()

// Lưu trữ client trong biến global trong môi trường development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma