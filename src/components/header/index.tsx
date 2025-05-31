"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Sun, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Avatar className="h-9 w-9 border-2 border-[#EC8305] group-hover:shadow-lg group-hover:border-white transition-all duration-200">
            <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
            <AvatarFallback className="bg-[#EC8305] text-white">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline font-semibold text-white group-hover:text-[#EC8305] transition-colors duration-200">
            {user?.name}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
            <AvatarFallback className="bg-[#EC8305] text-white">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span
              className="font-medium truncate block max-w-xs"
              title={user?.name}
            >
              {user?.name}
            </span>
            <span
              className="text-sm text-muted-foreground truncate block max-w-xs"
              title={user?.email}
            >
              {user?.email}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {isAdmin() && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primaryCustom to-primaryCustom/90 backdrop-blur supports-[backdrop-filter]:bg-primaryCustom/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-baseline group">
              <span className="text-lg text-[#EC8305] font-bold transition-colors group-hover:text-[#EC8305]/80">iam</span>{" "}
              <span className="text-2xl text-white font-bold transition-colors group-hover:text-white/80">HoangKhang</span>
            </Link>
            <div className="animate-spin-slow text-4xl text-[#EC8305]">
              <Sun size={24} fill="currentColor" />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="lg"
                asChild
                className="text-white font-medium hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}

            <div className="ml-4 flex items-center space-x-2 border-l border-white/20 pl-4">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="text-white font-medium hover:text-white hover:bg-white/10"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="bg-[#EC8305] text-white font-medium hover:bg-[#EC8305]/90 transition-colors"
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-900">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="justify-start text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-4 mb-6 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <Avatar className="h-12 w-12 border-2 border-[#EC8305]">
                          <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                          <AvatarFallback className="bg-[#EC8305] text-white">
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start w-full text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/profile">
                          <User className="mr-2 h-5 w-5" />
                          Profile
                        </Link>
                      </Button>
                      {isAdmin() && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/admin/dashboard">
                            <Settings className="mr-2 h-5 w-5" />
                            Admin Panel
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        className="justify-start w-full text-lg mt-2"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Đăng xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start w-full text-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        className="justify-start w-full text-lg mt-2 bg-[#EC8305] text-white hover:bg-[#EC8305]/90"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
