'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, ImagePlus, X, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/supabase'
import { TinyEditor } from '@/components/TinyEditor'

export default function CompleteRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    dob: '',
    avatar: null as File | null,
    password: '',
    confirmPassword: ''
  })

  // Verify temp token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const tempToken = localStorage.getItem('tempToken')
      
      if (!tempToken || !email) {
        router.push('/register/email')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-otp?token=${encodeURIComponent(tempToken)}`)
        const data = await response.json()

        if (!response.ok || !data.valid || data.email !== email) {
          localStorage.removeItem('tempToken')
          toast({
            title: "Phiên làm việc hết hạn",
            description: "Vui lòng thực hiện lại quá trình xác thực",
            variant: "destructive",
          })
          router.push('/register/email')
        }
      } catch (error) {
        console.error('Token verification error:', error)
        localStorage.removeItem('tempToken')
        router.push('/register/email')
      }
    }

    verifyToken()
  }, [email, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Lỗi",
            description: "Kích thước file không được vượt quá 5MB",
            variant: "destructive",
          })
          return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Lỗi",
            description: "Vui lòng chọn file hình ảnh",
            variant: "destructive",
          })
          return
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        setFormData(prev => ({
          ...prev,
          avatar: file
        }))
      } catch (error) {
        console.error('Avatar selection error:', error)
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi chọn ảnh đại diện",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập họ tên",
        variant: "destructive",
      })
      return
    }

    if (!formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let avatarUrl = null
      
      // Upload avatar if provided
      if (formData.avatar) {
        try {
          const { data, error } = await uploadFile(
            'avatar-images',
            `avatars/${Date.now()}-${formData.avatar.name}`,
            formData.avatar
          )
          if (error) {
            throw new Error('Failed to upload avatar')
          }
          avatarUrl = data?.publicUrl
        } catch (uploadError) {
          console.error('Avatar upload error:', uploadError)
          toast({
            title: "Cảnh báo",
            description: "Không thể tải lên ảnh đại diện, nhưng quá trình đăng ký sẽ tiếp tục",
            variant: "destructive",
          })
        }
      }

      // Get temp token
      const tempToken = localStorage.getItem('tempToken')
      if (!tempToken) {
        throw new Error('Phiên làm việc hết hạn')
      }

      // Complete registration
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: email!,
          password: formData.password,
          bio: formData.bio || undefined,
          dob: formData.dob ? new Date(formData.dob).toISOString() : null,
          avatar: avatarUrl,
          tempToken
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Lỗi",
          description: data.error || 'Có lỗi xảy ra khi hoàn tất đăng ký',
          variant: "destructive",
        })
        return
      }

      // Clear temp token
      localStorage.removeItem('tempToken')

      toast({
        title: "Thành công",
        description: "Đăng ký tài khoản thành công! Chào mừng bạn đến với Blog Platform.",
      })

      // Redirect to home or dashboard
      router.push('/')

    } catch (error) {
      console.error('Complete registration error:', error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi hoàn tất đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-blue-900 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Hoàn tất đăng ký
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Email đã được xác thực</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bước 3: Hoàn tất thông tin cá nhân
              </h3>
              <p className="text-sm text-gray-600">
                Email: <span className="font-semibold text-blue-600">{email}</span>
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-4">
              <Label>Ảnh đại diện (tùy chọn)</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
                  {avatarPreview ? (
                    <>
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null)
                          setFormData(prev => ({ ...prev, avatar: null }))
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Chọn ảnh
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Bio Editor */}
            <div className="space-y-2">
              <Label>Giới thiệu bản thân (tùy chọn)</Label>
              <TinyEditor
                value={formData.bio}
                onEditorChange={(content) => {
                  setFormData(prev => ({ ...prev, bio: content }))
                }}
                height={200}
                minimalSetup={true}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#EC8305] hover:bg-[#D97704]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang hoàn tất đăng ký...
                </>
              ) : (
                'Hoàn tất đăng ký'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
