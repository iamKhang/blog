# Chuyển đổi từ PostgreSQL sang MongoDB

Dự án đã được cấu hình lại để sử dụng MongoDB thay vì PostgreSQL. Dưới đây là các bước để hoàn tất quá trình chuyển đổi:

## 1. Cài đặt MongoDB

Nếu bạn chưa cài đặt MongoDB, bạn có thể:
- Sử dụng MongoDB Atlas (dịch vụ đám mây): [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Cài đặt MongoDB Community Edition trên máy tính: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

## 2. Cập nhật biến môi trường

Cập nhật file `.env` với chuỗi kết nối MongoDB của bạn:

```
DATABASE_URL="mongodb://localhost:27017/blog"
```

Chuỗi kết nối này sử dụng MongoDB cục bộ trên máy tính của bạn. Đảm bảo rằng MongoDB đã được cài đặt và đang chạy trên máy tính của bạn.

## 3. Tạo lại Prisma client

Chạy lệnh sau để tạo lại Prisma client với schema MongoDB mới:

```bash
npm run prisma:generate
```

## 4. Đồng bộ schema với cơ sở dữ liệu

Chạy lệnh sau để đồng bộ schema với cơ sở dữ liệu MongoDB:

```bash
npm run prisma:push
```

## 5. Khởi động lại ứng dụng

```bash
npm run dev
```

## Lưu ý quan trọng

1. **Dữ liệu hiện tại**: Quá trình chuyển đổi này không bao gồm việc di chuyển dữ liệu từ PostgreSQL sang MongoDB. Bạn sẽ cần nhập lại dữ liệu vào MongoDB.

2. **Các thay đổi trong schema**:
   - ID: Sử dụng `ObjectId` thay vì `cuid()`
   - Quan hệ: Sử dụng mảng ID thay vì quan hệ trực tiếp
   - Các trường Text: Không còn sử dụng `@db.Text`

3. **Các thay đổi trong API**:
   - Cập nhật các truy vấn để phù hợp với cấu trúc MongoDB
   - Sử dụng `technologyIds`, `categoryIds`, `tagIds` thay vì quan hệ `connect`

## Khắc phục sự cố

Nếu bạn gặp lỗi TypeScript sau khi chuyển đổi, hãy thử:

1. Xóa thư mục `.next` và `node_modules/.prisma`
2. Chạy lại `npm run prisma:generate`
3. Khởi động lại ứng dụng

Nếu bạn gặp lỗi kết nối, hãy kiểm tra:
1. Chuỗi kết nối MongoDB trong file `.env`
2. Cấu hình mạng và tường lửa
3. Quyền truy cập vào cơ sở dữ liệu MongoDB
