"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, ArrowRight, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

// Custom X (Twitter) Icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)

    try {
      // Here you would typically send the email to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Đăng ký thành công! 🎉",
        description: "Cảm ơn bạn đã đăng ký nhận bản tin của chúng tôi.",
      })
      setEmail("")
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/iamHoangKhang/",
      icon: Facebook,
      color: "hover:text-blue-400",
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/iamkhanggg",
      icon: XIcon,
      color: "hover:text-gray-300",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/iamkhanggg",
      icon: Instagram,
      color: "hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/iamhoangkhanggg/",
      icon: Linkedin,
      color: "hover:text-blue-300",
    },
    {
      name: "GitHub",
      url: "https://github.com/iamKhang",
      icon: Github,
      color: "hover:text-gray-300",
    },
  ]

  const quickLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Giới thiệu", href: "/about" },
    { name: "Bài viết", href: "/blog" },
    { name: "Dự án", href: "/projects" },
  ]

  const resourceLinks = [
    { name: "Tài liệu học tập", href: "/learning" },
    { name: "Câu hỏi thường gặp", href: "/faq" },
    { name: "Chính sách bảo mật", href: "/privacy" },
    { name: "Điều khoản dịch vụ", href: "/terms" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC8305]/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EC8305]/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#EC8305] to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  iamHoangKhang
                </h2>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Chia sẻ kiến thức lập trình, công nghệ và những trải nghiệm trong hành trình phát triển phần mềm.
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Kết nối với tôi</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`group relative p-3 bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 transition-all duration-300 hover:scale-110 hover:bg-blue-700/50 ${social.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {social.name}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-[#EC8305] to-orange-500 rounded-full mr-3"></div>
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-blue-100 hover:text-white transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-3 text-[#EC8305] transform group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="relative">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#EC8305] group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-[#EC8305] to-orange-500 rounded-full mr-3"></div>
              Tài nguyên
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-blue-100 hover:text-white transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-3 text-[#EC8305] transform group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="relative">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#EC8305] group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-[#EC8305] to-orange-500 rounded-full mr-3"></div>
              Cập nhật mới nhất
            </h3>

            <div className="space-y-4">
              <p className="text-blue-100 text-sm leading-relaxed">
                Đăng ký nhận bản tin để cập nhật những bài viết và kiến thức mới nhất.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubscribing}
                    className="bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-white placeholder-blue-300 focus:border-[#EC8305] focus:ring-2 focus:ring-[#EC8305]/20 transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-[#EC8305] to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đăng ký ngay"
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Email */}
            <div className="pt-4 border-t border-blue-700/50">
              <a
                href="mailto:hoangkhang.dev@gmail.com"
                className="group flex items-center text-blue-100 hover:text-white transition-all duration-300"
              >
                <div className="p-2 bg-blue-800/50 backdrop-blur-sm rounded-lg mr-3 group-hover:bg-[#EC8305]/20 transition-all duration-300">
                  <Mail className="w-4 h-4 text-[#EC8305]" />
                </div>
                <div>
                  <div className="text-xs text-blue-300 mb-1">Liên hệ trực tiếp</div>
                  <div className="font-medium">hoangkhang.dev@gmail.com</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-blue-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-blue-100 text-sm">
                © {new Date().getFullYear()} <span className="font-semibold text-white">iamHoangKhang</span>. Tất cả
                quyền được bảo lưu.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-blue-100 hover:text-white transition-colors duration-300">
                Chính sách bảo mật
              </Link>
              <span className="text-blue-700">•</span>
              <Link href="/terms" className="text-blue-100 hover:text-white transition-colors duration-300">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC8305] via-orange-500 to-[#EC8305]"></div>
    </footer>
  )
}
