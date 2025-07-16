"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2, Mail, Lock, LogIn } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) clearError()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await login(formData.email, formData.password)
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: "linear-gradient(to bottom right, #EC8305, rgb(251 146 60), rgb(250 204 21))",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-700/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl relative z-10 overflow-hidden">
        {/* Header with blue background */}
        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90"></div>
          <div className="relative z-10 text-center py-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#EC8305] to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-white/20">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Đăng nhập</CardTitle>
            <p className="text-blue-100 text-sm">Chào mừng bạn trở lại!</p>
          </div>
          {/* Decorative wave */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 bg-white"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
            }}
          ></div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8 pt-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-900" />
                <span>Email</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-4 pr-4 h-12 border-2 border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all duration-200 rounded-lg bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-900" />
                <span>Mật khẩu</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-4 pr-12 h-12 border-2 border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all duration-200 rounded-lg bg-gray-50 focus:bg-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-blue-900 transition-colors rounded-md"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#EC8305] hover:text-orange-600 font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 px-8 pb-8">
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] relative overflow-hidden"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Đăng nhập
                  </>
                )}
              </div>
            </Button>

            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-[#EC8305] hover:text-orange-600 font-semibold transition-colors hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </span>
            </div>
          </CardFooter>
        </form>

        {/* Bottom decorative accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC8305] to-orange-500"></div>
      </Card>
    </div>
  )
}
