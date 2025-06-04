'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { TinyEditor } from '@/components/TinyEditor'
import { uploadFile } from '@/lib/supabase'
import Image from 'next/image'
import { useAuthStore, authFetch } from '@/store/useAuthStore'

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
  const [isUploading, setIsUploading] = useState(false)

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
          startDate: startDate ? new Date(startDate + '-01').toISOString() : null,
          endDate: !endDate || endDate === '' ? null : new Date(endDate + '-01').toISOString(),
          description
        })),
        experience: profile.experience.map(({ id, company, position, startDate, endDate, description }) => ({
          id,
          company,
          position,
          startDate: startDate ? new Date(startDate + '-01').toISOString() : null,
          endDate: !endDate || endDate === '' ? null : new Date(endDate + '-01').toISOString(),
          description
        }))
      }

      console.log('updating profile with data:', cleanProfile)
      const response = await authFetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { data, error } = await uploadFile(
        'avatar-images',
        `avatars/${Date.now()}-${file.name}`,
        file
      )

      if (error) throw error
      if (!data) throw new Error('No data returned from upload')

      setProfile(prev => prev ? {
        ...prev,
        avatar: data.publicUrl
      } : null)

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
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
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="shadow-lg rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Avatar</h3>
              <div className="flex items-center gap-4">
                {profile.avatar && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={profile.avatar}
                      alt="Profile avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Avatar
                          </>
                        )}
                      </Button>
                    </div>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <TinyEditor
                  value={profile.bio}
                  onEditorChange={(content) => handleChange('bio', content)}
                  height={200}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('skills')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              {profile.skills.map((skill, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={skill.name}
                      onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={skill.category}
                      onChange={(e) => updateItem('skills', index, 'category', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Level (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => updateItem('skills', index, 'level', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem('skills', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('socialLinks')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
              {profile.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      value={link.platform}
                      onChange={(e) => updateItem('socialLinks', index, 'platform', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateItem('socialLinks', index, 'url', e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem('socialLinks', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Education</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('education')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              {profile.education.map((edu, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>School</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateItem('education', index, 'school', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateItem('education', index, 'field', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Start Month</Label>
                        <Input
                          type="month"
                          value={edu.startDate ? edu.startDate.slice(0, 7) : ''}
                          onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Month</Label>
                        {edu.endDate === null || edu.endDate === '' ? (
                          <div className="flex items-center gap-2">
                            <span>Hiện nay</span>
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => updateItem('education', index, 'endDate', new Date().toISOString().slice(0, 7))}
                            />
                            <span className="text-xs">Bỏ chọn để nhập tháng kết thúc</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="month"
                              value={edu.endDate ? edu.endDate.slice(0, 7) : ''}
                              onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                            />
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => updateItem('education', index, 'endDate', null)}
                            />
                            <span className="text-xs">Hiện nay</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={edu.description || ''}
                      onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem('education', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Experience</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('experience')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              {profile.experience.map((exp, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Start Month</Label>
                        <Input
                          type="month"
                          value={exp.startDate ? exp.startDate.slice(0, 7) : ''}
                          onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Month</Label>
                        {exp.endDate === null || exp.endDate === '' ? (
                          <div className="flex items-center gap-2">
                            <span>Hiện nay</span>
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => updateItem('experience', index, 'endDate', new Date().toISOString().slice(0, 7))}
                            />
                            <span className="text-xs">Bỏ chọn để nhập tháng kết thúc</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="month"
                              value={exp.endDate ? exp.endDate.slice(0, 7) : ''}
                              onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                            />
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => updateItem('experience', index, 'endDate', null)}
                            />
                            <span className="text-xs">Hiện nay</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <TinyEditor
                      value={exp.description}
                      onEditorChange={(content) => updateItem('experience', index, 'description', content)}
                      height={200}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem('experience', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 