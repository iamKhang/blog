"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/hooks/useUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"
import { Loader2, ImagePlus, X, EyeIcon, EyeOffIcon, User, Lock, Calendar, Mail, Shield } from "lucide-react"
import { uploadFile } from "@/lib/supabase"
import { TinyEditor } from "@/components/TinyEditor"
import Image from "next/image"

export default function ProfilePage() {
  const { user, isLoading, error, refresh } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    dob: "",
    avatar: null as File | null,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Cập nhật form data khi user data thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        bio: user.bio || "",
        dob: user.dob ? format(new Date(user.dob), "yyyy-MM-dd") : "",
        avatar: user.avatar ? new File([user.avatar], user.avatar) : null,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

        setFormData((prev) => ({
          ...prev,
          avatar: file,
        }))
      } catch (error) {
        console.error("Avatar selection error:", error)
        toast({
          title: "Error",
          description: "Failed to select avatar",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setIsUpdating(true)
      let avatarUrl = null

      if (formData.avatar) {
        try {
          const { data, error } = await uploadFile(
            "avatar-images",
            `avatars/${Date.now()}-${formData.avatar.name}`,
            formData.avatar,
          )
          if (error) {
            throw new Error("Failed to upload avatar")
          }
          avatarUrl = data?.publicUrl
        } catch (uploadError) {
          console.error("Avatar upload error:", uploadError)
          toast({
            title: "Avatar upload failed",
            description: "Failed to upload profile picture, but update will continue",
            variant: "destructive",
          })
        }
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl || user.avatar,
          dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      })
      setIsEditing(false)
      await refresh()
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp",
        variant: "destructive",
      })
      return
    }

    try {
      setIsChangingPassword(true)
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật",
      })

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setIsChangingPassword(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
                <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-100 bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
                </div>
                <Button
                  variant={isEditing ? "destructive" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  size="sm"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit}>
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                          {avatarPreview ? (
                            <>
                              <Image
                                src={avatarPreview || "/placeholder.svg"}
                                alt="Avatar preview"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarPreview(null)
                                  setFormData((prev) => ({ ...prev, avatar: null }))
                                }}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <ImagePlus className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-32"
                        >
                          <ImagePlus className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    ) : (
                      <Avatar className="h-32 w-32 border-4 border-gray-100 shadow-lg">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex-1 space-y-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="text-lg"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Shield className="w-4 h-4 mr-2" />
                            {user.role === "ADMIN" ? "Administrator" : "User"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    {isEditing ? (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                        <TinyEditor
                          value={formData.bio}
                          onEditorChange={(content) => {
                            setFormData((prev) => ({ ...prev, bio: content }))
                          }}
                          height={200}
                          minimalSetup={true}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        {user.bio ? (
                          <div
                            className="text-gray-700 prose max-w-none prose-sm"
                            dangerouslySetInnerHTML={{ __html: user.bio }}
                          />
                        ) : (
                          <p className="text-gray-500 italic">No bio added yet</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                    {isEditing ? (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Date of Birth</label>
                        <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        {user.dob ? (
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-4 h-4 mr-2" />
                            {format(new Date(user.dob), "dd MMMM yyyy", { locale: vi })}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Date of birth not set</p>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <Card className="border border-gray-100 bg-white">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Account Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Member since</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(user.createdAt), "MMM dd, yyyy", { locale: vi })}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Last updated</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(user.updatedAt), "MMM dd, yyyy", { locale: vi })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border border-gray-100 bg-white">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isChangingPassword} className="w-full">
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
