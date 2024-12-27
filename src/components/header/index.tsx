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
import { Menu, Sun } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About" },
  { href: "/posts", label: "Posts" },
  { href: "/resources", label: "Resources" },
  { href: "/projects", label: "Projects" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
