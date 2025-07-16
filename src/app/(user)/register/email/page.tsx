'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, ArrowRight, UserPlus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function RegisterEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [canRequestOTP, setCanRequestOTP] = useState(true)

  // Check OTP status when component mounts
  useEffect(() => {
    const checkOTPStatus = async () => {
      if (!email || !email.includes('@')) return // Only check if email is valid

      try {
        const response = await fetch(`/api/auth/send-otp?email=${encodeURIComponent(email)}`)
        const data = await response.json()

        if (response.ok && data.hasActiveOTP && data.remainingTime > 0) {
          setRemainingTime(data.remainingTime)
          setCanRequestOTP(false)
          startCountdown(data.remainingTime)
        } else {
          setCanRequestOTP(true)
          setRemainingTime(0)
        }
      } catch (error) {
        console.error('Error checking OTP status:', error)
      }
    }

    if (email && email.includes('@')) {
      checkOTPStatus()
    }
  }, [email])

  // Countdown timer
  const startCountdown = (initialTime: number) => {
    let timeLeft = initialTime
    const timer = setInterval(() => {
      timeLeft -= 1
      setRemainingTime(timeLeft)
      
      if (timeLeft <= 0) {
        clearInterval(timer)
        setCanRequestOTP(true)
        setRemainingTime(0)
      }
    }, 1000)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email",
        variant: "destructive",
      })
      return
    }

    if (!canRequestOTP) {
      toast({
        title: "Thông báo",
        description: `Vui lòng đợi ${formatTime(remainingTime)} trước khi gửi lại OTP`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          // Too many requests - OTP already sent
          setRemainingTime(data.remainingTime || 300)
          setCanRequestOTP(false)
          startCountdown(data.remainingTime || 300)
          toast({
            title: "Thông báo",
            description: data.error || "OTP đã được gửi trước đó. Vui lòng đợi hết thời gian hiệu lực.",
            variant: "destructive",
          })
        } else {
          // Other errors like email already registered
          toast({
            title: "Lỗi",
            description: data.error || 'Có lỗi xảy ra khi gửi OTP',
            variant: "destructive",
          })
        }
        return // Don't throw error, just return
      }

      toast({
        title: "Thành công",
        description: data.message,
      })

      // Start countdown
      setRemainingTime(data.expiresIn || 300)
      setCanRequestOTP(false)
      startCountdown(data.expiresIn || 300)

      // Redirect to OTP verification page
      router.push(`/register/verify-otp?email=${encodeURIComponent(email)}`)

    } catch (error) {
      console.error('Send OTP error:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Đăng ký tài khoản</CardTitle>
            <p className="text-blue-100 text-sm">Bước 1: Xác thực email</p>
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
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Nhập email của bạn để nhận mã xác thực OTP
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-900" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-4 pr-4 h-12 border-2 border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all duration-200 rounded-lg bg-gray-50 focus:bg-white"
              />
            </div>

            {!canRequestOTP && remainingTime > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-yellow-800">
                    OTP đã được gửi. Có thể gửi lại sau: <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 px-8 pb-8">
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] relative overflow-hidden"
              disabled={isLoading || (!canRequestOTP && remainingTime > 0)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang gửi OTP...
                  </>
                ) : (
                  <>
                    Gửi mã OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </div>
            </Button>
            
            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-[#EC8305] hover:text-orange-600 font-semibold transition-colors hover:underline">
                  Đăng nhập tại đây
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
