import { PrismaClient } from '@prisma/client'

// Tạo Prisma Client với cấu hình phù hợp cho MongoDB với replica set
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'], // Chỉ log lỗi và cảnh báo
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Sử dụng client đã tồn tại hoặc tạo mới
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Lưu trữ client trong biến global trong môi trường development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma