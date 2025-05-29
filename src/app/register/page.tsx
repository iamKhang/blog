'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2, ImagePlus, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/supabase'
import { TinyEditor } from '@/components/TinyEditor'

export default function RegistrationPage() {
  const router = useRouter()
  const { register, isLoading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    dob: '',
    avatar: null as File | null
  })

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
        // Tạo preview
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
          title: "Error",
          description: "Failed to select avatar",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      let avatarUrl = null
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
            title: "Avatar upload failed",
            description: "Failed to upload profile picture, but registration will continue",
            variant: "destructive",
          })
        }
      }

      await register(
        formData.name,
        formData.email,
        formData.password,
        {
          avatar: avatarUrl,
          bio: formData.bio || undefined,
          dob: formData.dob ? new Date(formData.dob).toISOString() : null
        }
      )

      toast({
        title: "Success",
        description: "Registration successful! Redirecting...",
      })

      router.push('/')

    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-blue-900 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Profile Picture</Label>
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
                >
                  Upload Picture
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Bio Editor */}
            <div className="space-y-2">
              <Label>Bio</Label>
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
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-900 hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}