'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2, User, BookOpen, Briefcase, Link } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { TinyEditor } from '@/components/TinyEditor'
import Image from 'next/image'

interface Skill {
  id?: string
  name: string
  category: string
  level: number
}

interface SocialLink {
  id?: string
  platform: string
  url: string
}

interface Education {
  id?: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  description?: string
}

interface Experience {
  id?: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
}

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar: string
  email: string
  location: string
  skills: Skill[]
  socialLinks: SocialLink[]
  education: Education[]
  experience: Experience[]
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (isAuthLoading) return // Đợi cho đến khi auth state được load xong

    if (!user || user.role !== 'ADMIN') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push('/')
      return
    }

    fetchProfile()
  }, [user, isAuthLoading, router])

  const fetchProfile = async () => {
    try {
      console.log('fetching profile')
      console.log(user)
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    if (!profile.id) {
      toast({
        title: "Error",
        description: "Profile ID is missing",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Clean up the data before sending
      const cleanProfile = {
        ...profile,
        skills: profile.skills.map(({ id, name, category, level }) => ({
          id,
          name,
          category,
          level
        })),
        socialLinks: profile.socialLinks.map(({ id, platform, url }) => ({
          id,
          platform,
          url
        })),
        education: profile.education.map(({ id, school, degree, field, startDate, endDate, description }) => ({
          id,
          school,
          degree,
          field,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: !endDate || endDate === '' ? null : new Date(endDate).toISOString(),
          description
        })),
        experience: profile.experience.map(({ id, company, position, startDate, endDate, description }) => ({
          id,
          company,
          position,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: !endDate || endDate === '' ? null : new Date(endDate).toISOString(),
          description
        }))
      }

      console.log('updating profile with data:', cleanProfile)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(cleanProfile),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof Profile, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null)
  }

  const addItem = (field: 'skills' | 'socialLinks' | 'education' | 'experience') => {
    const newItem = {
      ...(field === 'skills' ? { name: '', category: '', level: 3 } :
        field === 'socialLinks' ? { platform: '', url: '' } :
        field === 'education' ? { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' } :
        { company: '', position: '', startDate: '', endDate: '', description: '' })
    }
    setProfile(prev => prev ? {
      ...prev,
      [field]: [...prev[field], newItem]
    } : null)
  }

  const removeItem = (field: 'skills' | 'socialLinks' | 'education' | 'experience', index: number) => {
    setProfile(prev => prev ? {
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    } : null)
  }

  const updateItem = (field: 'skills' | 'socialLinks' | 'education' | 'experience', index: number, key: string, value: any) => {
    setProfile(prev => prev ? {
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    } : null)
  }



  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null // Không render gì cả vì sẽ bị chuyển hướng
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa hồ sơ</h1>
          <p className="text-gray-600">Cập nhật thông tin cá nhân và kinh nghiệm của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                <User className="h-5 w-5 text-blue-600" />
                Ảnh đại diện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                  <Image
                    src="https://nuvyktdqoclzyglcwukn.supabase.co/storage/v1/object/public/avatar-images//anhthe.jpg"
                    alt="Profile avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Avatar được thiết lập cố định</p>
                  <p className="text-xs text-gray-500">Ảnh đại diện sẽ được hiển thị trên trang About Me</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                <User className="h-5 w-5 text-blue-600" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Họ và tên</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Chức danh</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Địa chỉ</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Giới thiệu</Label>
                <TinyEditor
                  value={profile.bio}
                  onEditorChange={(content) => handleChange('bio', content)}
                  height={200}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Kỹ năng
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('skills')}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm kỹ năng
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Tên kỹ năng</Label>
                    <Input
                      value={skill.name}
                      onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Danh mục</Label>
                    <Input
                      value={skill.category}
                      onChange={(e) => updateItem('skills', index, 'category', e.target.value)}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Mức độ (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => updateItem('skills', index, 'level', parseInt(e.target.value))}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem('skills', index)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <Link className="h-5 w-5 text-purple-600" />
                  Liên kết xã hội
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('socialLinks')}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm liên kết
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Nền tảng</Label>
                    <Input
                      value={link.platform}
                      onChange={(e) => updateItem('socialLinks', index, 'platform', e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateItem('socialLinks', index, 'url', e.target.value)}
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem('socialLinks', index)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Học vấn
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('education')}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm học vấn
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="space-y-4 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Trường học</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateItem('education', index, 'school', e.target.value)}
                        required
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Bằng cấp</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                        required
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Chuyên ngành</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateItem('education', index, 'field', e.target.value)}
                        required
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Tháng bắt đầu</Label>
                        <Input
                          type="month"
                          value={edu.startDate ? edu.startDate.slice(0, 7) : ''}
                          onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                          required
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Tháng kết thúc</Label>
                        {edu.endDate === null || edu.endDate === '' ? (
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <span className="text-sm text-gray-600">Hiện nay</span>
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => updateItem('education', index, 'endDate', new Date().toISOString().slice(0, 7))}
                              className="text-orange-600"
                            />
                            <span className="text-xs text-gray-500">Bỏ chọn để nhập tháng kết thúc</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="month"
                              value={edu.endDate ? edu.endDate.slice(0, 7) : ''}
                              onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                            />
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => updateItem('education', index, 'endDate', null)}
                              className="text-orange-600"
                            />
                            <span className="text-xs text-gray-500">Hiện nay</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Mô tả</Label>
                    <Textarea
                      value={edu.description || ''}
                      onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem('education', index)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  Kinh nghiệm làm việc
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('experience')}
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm kinh nghiệm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="space-y-4 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Công ty</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                        required
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Vị trí</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                        required
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Tháng bắt đầu</Label>
                        <Input
                          type="month"
                          value={exp.startDate ? exp.startDate.slice(0, 7) : ''}
                          onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                          required
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Tháng kết thúc</Label>
                        {exp.endDate === null || exp.endDate === '' ? (
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <span className="text-sm text-gray-600">Hiện nay</span>
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => updateItem('experience', index, 'endDate', new Date().toISOString().slice(0, 7))}
                              className="text-indigo-600"
                            />
                            <span className="text-xs text-gray-500">Bỏ chọn để nhập tháng kết thúc</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="month"
                              value={exp.endDate ? exp.endDate.slice(0, 7) : ''}
                              onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => updateItem('experience', index, 'endDate', null)}
                              className="text-indigo-600"
                            />
                            <span className="text-xs text-gray-500">Hiện nay</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Mô tả công việc</Label>
                    <TinyEditor
                      value={exp.description}
                      onEditorChange={(content) => updateItem('experience', index, 'description', content)}
                      height={200}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem('experience', index)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-600">
            <CardContent className="pt-6">
              <Button
                type="submit"
                className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3 text-lg"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}