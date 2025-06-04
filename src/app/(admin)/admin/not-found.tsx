"use client";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang</h1>
        <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại.</p>
        <a href="/admin/dashboard" className="text-blue-600 hover:underline">Quay lại trang chủ</a>
      </div>
    </div>
  );
}
