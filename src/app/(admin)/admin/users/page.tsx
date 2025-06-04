"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";

export default function UsersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setLoading(false);
      return;
    }
    fetch("/api/users")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "Lỗi tải dữ liệu");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  // Helper format date
  function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  if (loading) return <div className="py-10 text-center text-gray-500">Đang tải danh sách người dùng...</div>;
  if (!user || user.role !== "ADMIN") return <div className="py-10 text-center text-red-500 font-semibold">Bạn không có quyền truy cập trang này.</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Avatar</th>
            <th className="px-4 py-2 text-left">Tên</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Ngày sinh</th>
            <th className="px-4 py-2 text-left">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b hover:bg-blue-50">
              <td className="px-4 py-2">
                {u.avatar ? (
                  <Image src={u.avatar} alt={u.name} width={40} height={40} className="rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                    {u.name?.charAt(0)}
                  </div>
                )}
              </td>
              <td className="px-4 py-2 font-semibold">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">
                <span className={u.role === "ADMIN" ? "text-red-600 font-bold" : "text-gray-700"}>{u.role}</span>
              </td>
              <td className="px-4 py-2">{formatDate(u.dob)}</td>
              <td className="px-4 py-2">{formatDate(u.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
