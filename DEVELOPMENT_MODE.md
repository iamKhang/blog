# Chế độ phát triển (Development Mode)

Dự án hiện đang được cấu hình ở chế độ phát triển, cho phép truy cập vào tất cả các trang mà không cần đăng nhập hoặc xác thực.

## Các thay đổi đã thực hiện

1. **Middleware** (`src/middleware.ts`):
   - Đã bỏ qua kiểm tra xác thực cho các route `/admin/*`
   - Luôn cho phép truy cập vào tất cả các trang

2. **AdminLayout** (`src/components/layouts/admin-layout.tsx`):
   - Đã bỏ qua kiểm tra xác thực và quyền admin
   - Luôn render layout admin bất kể trạng thái đăng nhập

3. **withAdminAuth HOC** (`src/components/auth/withAdminAuth.tsx`):
   - Đã bỏ qua kiểm tra xác thực và quyền admin
   - Luôn render component được bọc bất kể trạng thái đăng nhập

## Chuyển sang chế độ sản xuất (Production Mode)

Khi bạn sẵn sàng chuyển sang chế độ sản xuất và bật lại xác thực, hãy thực hiện các bước sau:

1. Trong file `src/middleware.ts`:
   - Bỏ comment phần code được đánh dấu là "PRODUCTION MODE"
   - Comment hoặc xóa dòng `return NextResponse.next();` ở đầu hàm middleware

2. Trong file `src/components/layouts/admin-layout.tsx`:
   - Bỏ comment phần code được đánh dấu là "PRODUCTION MODE"
   - Comment hoặc xóa phần code được đánh dấu là "DEVELOPMENT MODE"

3. Trong file `src/components/auth/withAdminAuth.tsx`:
   - Bỏ comment phần code được đánh dấu là "PRODUCTION MODE"
   - Comment hoặc xóa phần code được đánh dấu là "DEVELOPMENT MODE"

## Lưu ý bảo mật

Chế độ phát triển này chỉ nên được sử dụng trong môi trường phát triển cục bộ. Đảm bảo rằng bạn đã bật lại xác thực trước khi triển khai ứng dụng lên môi trường sản xuất.

Các trang admin chứa thông tin nhạy cảm và chức năng quản trị, vì vậy việc bảo vệ chúng bằng xác thực thích hợp là rất quan trọng trong môi trường sản xuất.
