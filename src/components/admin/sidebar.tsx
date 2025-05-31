"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  BookOpen,
  ChevronRight,
  UserRound,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bài viết",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Series",
    href: "/admin/series",
    icon: BookOpen,
  },
  {
    title: "Dự án",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Hồ sơ",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white h-full flex flex-col shadow-xl rounded-r-2xl">
      {/* User Info & Home */}
      <div className="flex flex-col items-center gap-3 py-6 border-b border-blue-800">
        <button
          onClick={() => { window.location.href = '/'; }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EC8305] text-white font-semibold shadow hover:bg-[#d97a04] transition-colors mb-2 w-11/12 justify-center"
        >
          <Home className="w-5 h-5" />
          <span>Trang chủ</span>
        </button>
        <Avatar className="h-14 w-14 border-2 border-[#EC8305]">
          <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
          <AvatarFallback className="bg-[#EC8305] text-white text-xl">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center min-w-0 max-w-full px-2">
          <span className="font-bold text-base truncate max-w-full" title={user?.name}>{user?.name}</span>
          <span className="text-xs text-blue-200 truncate max-w-full" title={user?.email}>{user?.email}</span>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
        <div className="px-3 mb-4">
          <p className="text-xs uppercase text-blue-400 font-semibold tracking-wider px-4">Menu</p>
        </div>
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-700 text-white font-semibold shadow"
                      : "text-blue-200 hover:bg-blue-800/60 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5")} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors font-semibold"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </div>
        </button>
      </div>
    </div>
  );
}