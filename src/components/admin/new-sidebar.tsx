"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  UserRound,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

export function NewSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div 
      className={cn(
        "h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >

      {/* User Profile */}
      <div className={cn(
        "p-4 border-b border-blue-800",
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      )}>
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                  <AvatarFallback className="bg-blue-600">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
              <AvatarFallback className="bg-blue-600">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium text-sm">{user?.name || 'User'}</p>
              <p className="text-xs text-blue-300">{user?.email || 'user@example.com'}</p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                {collapsed ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-center p-3 rounded-lg transition-colors",
                            isActive
                              ? "bg-blue-700 text-white"
                              : "text-blue-300 hover:bg-blue-800/50 hover:text-white"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-blue-300 hover:bg-blue-800/50 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800">
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-full flex justify-center text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Đăng xuất
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-red-400 hover:bg-red-900/20 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile sidebar (using Sheet component)
  const MobileSidebar = () => (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-blue-900 to-blue-950">
          <div className="h-full flex flex-col">
            {/* User Profile */}
            <div className="p-4 border-b border-blue-800 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium text-sm text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-blue-300">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-700 text-white"
                            : "text-blue-300 hover:bg-blue-800/50 hover:text-white"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-blue-800">
              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-start gap-3 text-red-400 hover:bg-red-900/20 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Đăng xuất</span>
              </Button>``
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
    </>
  );
}
