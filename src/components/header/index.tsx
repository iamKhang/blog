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
  { href: "/series", label: "Series" },
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
            <AvatarFallback className="bg-blue-500 text-white">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
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
    <header className="border-b bg-primaryCustom">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-baseline">
            <span className="text-lg text-[#EC8305] font-bold">iam</span>{" "}
            <span className="text-2xl text-white font-bold">HoangKhang</span>
          </Link>
          <div className="animate-spin-slow text-4xl text-[#EC8305] ml-2">
            <Sun size={30} fill="currentColor" />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="link"
              size="lg"
              asChild
              className="text-white font-semibold hover:transform hover:-translate-y-1 transition-transform duration-200"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}

          <div className="ml-4 flex items-center space-x-1 border-l-slate-200 border-l-2 pl-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="text-white font-semibold hover:text-white hover:bg-[#EC8305]"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-[#EC8305] text-white font-semibold hover:bg-blue-900"
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
              variant="link"
              size="icon"
              className="md:hidden text-white hover:text-black"
            >
              <Menu className="text-white !w-8 !h-8 " />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
              <div className="border-t pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    {isAdmin() && (
                      <Button
                        variant="ghost"
                        className="justify-start w-full mt-2"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/admin/dashboard">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      className="justify-start w-full mt-2"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      className="justify-start w-full mt-2 bg-blue-800 text-white hover:bg-blue-900"
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
    </header>
  );
}
