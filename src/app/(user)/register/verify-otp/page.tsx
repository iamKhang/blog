'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, ArrowLeft, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/register/email')
    }
  }, [email, router])

  // Check OTP status and start countdown
  useEffect(() => {
    const checkOTPStatus = async () => {
      if (!email) return
      
      try {
        const response = await fetch(`/api/auth/send-otp?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        
        if (data.hasActiveOTP && data.remainingTime > 0) {
          setRemainingTime(data.remainingTime)
          setCanResend(false)
          startCountdown(data.remainingTime)
        } else {
          setCanResend(true)
          setRemainingTime(0)
        }
      } catch (error) {
        console.error('Error checking OTP status:', error)
      }
    }

    checkOTPStatus()
  }, [email])

  // Countdown timer
  const startCountdown = (initialTime: number) => {
    let timeLeft = initialTime
    const timer = setInterval(() => {
      timeLeft -= 1
      setRemainingTime(timeLeft)
      
      if (timeLeft <= 0) {
        clearInterval(timer)
        setCanResend(true)
        setRemainingTime(0)
      }
    }, 1000)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const otpString = otp.join('')
    if (otpString.length !== 4) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ 4 chữ số OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email!,
          otp: otpString 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Lỗi",
          description: data.error || 'Có lỗi xảy ra khi xác thực OTP',
          variant: "destructive",
        })

        // Clear OTP inputs on error
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      toast({
        title: "Thành công",
        description: data.message,
      })

      // Store temp token and redirect to complete registration
      localStorage.setItem('tempToken', data.tempToken)
      router.push(`/register/complete?email=${encodeURIComponent(email!)}`)

    } catch (error) {
      console.error('Verify OTP error:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.",
        variant: "destructive",
      })

      // Clear OTP inputs on error
      setOtp(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend || !email) return

    setIsResending(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Lỗi",
          description: data.error || 'Có lỗi xảy ra khi gửi lại OTP',
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Thành công",
        description: "OTP mới đã được gửi đến email của bạn",
      })

      // Reset OTP inputs and start countdown
      setOtp(['', '', '', ''])
      setRemainingTime(data.expiresIn || 300)
      setCanResend(false)
      startCountdown(data.expiresIn || 300)
      inputRefs.current[0]?.focus()

    } catch (error) {
      console.error('Resend OTP error:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return null // Will redirect
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Xác thực OTP</CardTitle>
            <p className="text-blue-100 text-sm">Bước 2: Nhập mã xác thực</p>
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
                Mã OTP đã được gửi đến email: <br />
                <span className="font-semibold text-blue-600">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-center block text-gray-700 font-semibold">Nhập mã OTP (4 chữ số)</Label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all duration-200 rounded-lg"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {remainingTime > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-800">
                    Mã OTP hết hạn sau: <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className="text-[#EC8305] hover:text-orange-600 font-medium transition-colors"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi lại...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {canResend ? 'Gửi lại OTP' : `Gửi lại sau ${formatTime(remainingTime)}`}
                  </>
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] relative overflow-hidden"
              disabled={isLoading || otp.join('').length !== 4}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  'Xác thực OTP'
                )}
              </div>
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/register/email')}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </CardFooter>
        </form>

        {/* Bottom decorative accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC8305] to-orange-500"></div>
      </Card>
    </div>
  )
}
