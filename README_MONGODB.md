# Chuyển đổi sang MongoDB

Dự án này đã được cấu hình lại để sử dụng MongoDB thay vì PostgreSQL. Dưới đây là hướng dẫn nhanh để bắt đầu:

## Bước 1: Cài đặt MongoDB

Nếu bạn chưa cài đặt MongoDB, hãy tải và cài đặt MongoDB Community Edition:
- [Tải MongoDB Community Edition](https://www.mongodb.com/try/download/community)

## Bước 2: Khởi động MongoDB

### macOS (với Homebrew):
```bash
brew services start mongodb-community
```

### Windows:
```bash
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
```

### Linux:
```bash
sudo systemctl start mongod
```

## Bước 3: Kiểm tra kết nối MongoDB

Chạy script kiểm tra kết nối:
```bash
npm run check-mongodb
```

Nếu kết nối thành công, bạn sẽ thấy thông báo "Kết nối thành công đến MongoDB!".

## Bước 4: Tạo lại Prisma client

```bash
npm run prisma:generate
```

## Bước 5: Đồng bộ schema với MongoDB

```bash
npm run prisma:push
```

## Bước 6: Khởi động ứng dụng

```bash
npm run dev
```

## Tài liệu bổ sung

- [MONGODB_MIGRATION.md](./MONGODB_MIGRATION.md) - Hướng dẫn chi tiết về quá trình chuyển đổi
- [MONGODB_README.md](./MONGODB_README.md) - Tài liệu về cách sử dụng MongoDB trong dự án

## Khắc phục sự cố

Nếu bạn gặp vấn đề, hãy kiểm tra:

1. MongoDB đã được cài đặt và đang chạy
2. Chuỗi kết nối trong file `.env` là chính xác
3. Không có tường lửa chặn kết nối

Để xem trực tiếp dữ liệu trong MongoDB, bạn có thể sử dụng Prisma Studio:
```bash
npm run prisma:studio
```
