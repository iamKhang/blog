"use client";

import { FileText, FolderKanban, Users, TrendingUp, Eye, ThumbsUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome to your dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Bài viết</h2>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-800">0</p>
              <div className="flex items-center text-xs text-green-500 mb-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>0%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-green-100 rounded-lg">
            <FolderKanban className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Dự án</h2>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-800">0</p>
              <div className="flex items-center text-xs text-green-500 mb-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>0%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Người dùng</h2>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-800">0</p>
              <div className="flex items-center text-xs text-green-500 mb-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Thống kê lượt xem</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng lượt xem</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng lượt thích</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">Chưa có hoạt động nào gần đây</p>
          </div>
        </div>
      </div>
    </div>
  );
}