# Sử dụng TinyMCE trong dự án

Dự án này sử dụng TinyMCE làm trình soạn thảo văn bản phong phú (rich text editor) thông qua API key chính thức.

## Cấu hình TinyMCE

### 1. Đăng ký API key

Để sử dụng TinyMCE, bạn cần đăng ký một API key từ trang web chính thức của TinyMCE:

1. Truy cập [https://www.tiny.cloud/auth/signup/](https://www.tiny.cloud/auth/signup/)
2. Đăng ký tài khoản miễn phí
3. Lấy API key từ trang quản lý tài khoản

### 2. Cấu hình API key

Sau khi có API key, bạn cần thêm nó vào file `.env`:

```
NEXT_PUBLIC_TINYMCE_API_KEY="your-tinymce-api-key"
```

Thay thế `your-tinymce-api-key` bằng API key thực tế của bạn.

## Component TinyEditor

Dự án sử dụng một component tùy chỉnh `TinyEditor` để bọc TinyMCE và cung cấp các tính năng bổ sung:

- Hỗ trợ tải lên hình ảnh
- Cấu hình đầy đủ hoặc tối giản
- Tích hợp với React Hook Form

### Sử dụng TinyEditor

```tsx
import { TinyEditor } from '@/components/TinyEditor';

// Sử dụng với React Hook Form
<Controller
  name="content"
  control={control}
  render={({ field: { onChange, value } }) => (
    <TinyEditor
      value={value}
      onEditorChange={onChange}
      imagesUploadHandler={async (blobInfo) => {
        return await handleImageUpload(blobInfo.blob());
      }}
    />
  )}
/>

// Sử dụng với cấu hình tối giản
<TinyEditor
  value={content}
  onEditorChange={setContent}
  height={200}
  minimalSetup={true}
/>
```

### Props của TinyEditor

| Prop | Kiểu dữ liệu | Mặc định | Mô tả |
|------|--------------|----------|-------|
| `value` | string | (bắt buộc) | Nội dung hiện tại của trình soạn thảo |
| `onEditorChange` | function | (bắt buộc) | Hàm được gọi khi nội dung thay đổi |
| `height` | number | 500 | Chiều cao của trình soạn thảo (px) |
| `minimalSetup` | boolean | false | Sử dụng cấu hình tối giản thay vì đầy đủ |
| `imagesUploadHandler` | function | undefined | Hàm xử lý tải lên hình ảnh |

## Xử lý tải lên hình ảnh

TinyEditor hỗ trợ tải lên hình ảnh thông qua prop `imagesUploadHandler`. Hàm này nhận một tham số `blobInfo` và phải trả về một Promise với URL của hình ảnh đã tải lên.

Ví dụ:

```tsx
const handleImageUpload = async (file: Blob) => {
  // Tải lên file lên Supabase hoặc dịch vụ lưu trữ khác
  const imageUrl = await uploadFile(file, 'posts');
  return imageUrl;
};

<TinyEditor
  value={content}
  onEditorChange={setContent}
  imagesUploadHandler={async (blobInfo) => {
    return await handleImageUpload(blobInfo.blob());
  }}
/>
```

## Khắc phục sự cố

Nếu bạn gặp vấn đề với TinyMCE, hãy kiểm tra:

1. API key đã được cấu hình đúng trong file `.env`
2. Tên miền của bạn đã được thêm vào danh sách cho phép trong trang quản lý TinyMCE
3. Kết nối internet để tải các tài nguyên của TinyMCE

## Tài liệu tham khảo

- [TinyMCE Documentation](https://www.tiny.cloud/docs/)
- [TinyMCE React Integration](https://www.tiny.cloud/docs/integrations/react/)
- [TinyMCE Cloud Deployment](https://www.tiny.cloud/docs/cloud-deployment-guide/)
