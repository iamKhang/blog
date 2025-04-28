# Sử dụng MongoDB trong dự án Blog

Dự án này sử dụng MongoDB làm cơ sở dữ liệu chính thông qua Prisma ORM.

## Cấu trúc dữ liệu

Dự án sử dụng các model chính sau:

- **User**: Quản lý người dùng và xác thực
- **Post**: Quản lý bài viết
- **Project**: Quản lý dự án
- **Category**: Danh mục cho bài viết
- **Tag**: Thẻ cho bài viết
- **Technology**: Công nghệ sử dụng trong dự án
- **Session**: Quản lý phiên đăng nhập

## Kết nối với MongoDB

Kết nối được quản lý thông qua Prisma Client trong file `src/lib/prisma.ts`. Chuỗi kết nối được cấu hình trong file `.env` thông qua biến `DATABASE_URL`.

### MongoDB cục bộ

Dự án này được cấu hình để sử dụng MongoDB cục bộ với chuỗi kết nối:

```
mongodb://localhost:27017/blog
```

Để khởi động MongoDB cục bộ:

#### Trên macOS (với Homebrew):
```bash
brew services start mongodb-community
```

#### Trên Windows:
```bash
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
```

#### Trên Linux:
```bash
sudo systemctl start mongod
```

Để kiểm tra MongoDB đã chạy chưa:
```bash
mongo
```

hoặc với MongoDB Shell mới:
```bash
mongosh
```

## Truy vấn dữ liệu

Ví dụ truy vấn dữ liệu với Prisma và MongoDB:

```typescript
// Lấy tất cả dự án
const projects = await prisma.project.findMany({
  include: {
    technologies: true
  }
});

// Tạo dự án mới
const newProject = await prisma.project.create({
  data: {
    title: "Dự án mới",
    slug: "du-an-moi",
    excerpt: "Mô tả ngắn",
    description: "Mô tả chi tiết",
    thumbnail: "https://example.com/image.jpg",
    status: "IN_PROGRESS",
    technologyIds: ["id1", "id2"] // ID của các công nghệ
  }
});

// Cập nhật dự án
const updatedProject = await prisma.project.update({
  where: { id: "project-id" },
  data: {
    title: "Tên mới",
    isPinned: true
  }
});

// Xóa dự án
await prisma.project.delete({
  where: { id: "project-id" }
});
```

## Công cụ quản lý

Bạn có thể sử dụng Prisma Studio để quản lý dữ liệu:

```bash
npm run prisma:studio
```

## Tài liệu tham khảo

- [Prisma với MongoDB](https://www.prisma.io/docs/orm/overview/databases/mongodb)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)
