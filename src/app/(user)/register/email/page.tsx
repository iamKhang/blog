'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-blue-900 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Mail className="h-6 w-6" />
            Đăng ký tài khoản
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Bước 1: Xác thực email
              </h3>
              <p className="text-sm text-gray-600">
                Nhập email của bạn để nhận mã xác thực OTP
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#EC8305] hover:bg-[#D97704]"
              disabled={isLoading || (!canRequestOTP && remainingTime > 0)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi OTP...
                </>
              ) : (
                <>
                  Gửi mã OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <div className="text-center text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-blue-900 hover:underline">
                Đăng nhập tại đây
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
