import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Mail, Github, Linkedin, Twitter, Eye, Heart } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/types/project'

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about me and my skills',
}

// Hàm tạo màu sắc cho badges công nghệ
function getTechBadgeColor(techName: string): string {
  const colors: Record<string, string> = {
    'Java': 'bg-orange-500 text-white',
    'JavaScript': 'bg-yellow-400 text-black',
    'TypeScript': 'bg-blue-600 text-white',
    'HTML': 'bg-orange-600 text-white',
    'CSS': 'bg-blue-500 text-white',
    'React': 'bg-cyan-500 text-white',
    'React Native': 'bg-cyan-600 text-white',
    'NextJS': 'bg-black text-white',
    'NodeJS': 'bg-green-600 text-white',
    'NestJS': 'bg-red-600 text-white',
    'MongoDB': 'bg-green-500 text-white',
    'MySQL': 'bg-blue-700 text-white',
    'PostgreSQL': 'bg-blue-800 text-white',
    'Prisma': 'bg-indigo-600 text-white',
    'Docker': 'bg-blue-400 text-white',
    'Git': 'bg-orange-700 text-white',
    'GitHub': 'bg-gray-800 text-white',
    'Python': 'bg-yellow-500 text-black',
    'Spring Boot': 'bg-green-700 text-white',
    'Tailwind CSS': 'bg-teal-500 text-white',
    'Bootstrap': 'bg-purple-600 text-white',
    'Vue.js': 'bg-green-400 text-white',
    'Angular': 'bg-red-500 text-white',
    'Express.js': 'bg-gray-700 text-white',
    'Redis': 'bg-red-700 text-white',
    'AWS': 'bg-orange-400 text-white',
    'Vercel': 'bg-black text-white',
    'Supabase': 'bg-green-600 text-white',
    'Firebase': 'bg-yellow-600 text-white',
  }

  return colors[techName] || 'bg-gray-500 text-white'
}

async function getProfile() {
  const profile = await prisma.profile.findFirst({
    include: {
      skills: true,
      socialLinks: true,
      education: true,
      experience: true,
    },
  })
  return profile
}

async function getPinnedProjects() {
  const projects = await prisma.project.findMany({
    where: {
      isPinned: true,
      isHidden: false,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      description: true,
      thumbnail: true,
      techStack: true,
      status: true,
      viewedBy: true,
      likedBy: true,
      isPinned: true,
      isHidden: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Transform projects to include counts
  return projects.map(project => ({
    ...project,
    views: (project.viewedBy || []).length,
    likes: (project.likedBy || []).length,
    isLikedByUser: false, // Không cần check user trong about page
    techStack: project.techStack || [],
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }))
}

export default async function AboutMePage() {
  const [profile, pinnedProjects] = await Promise.all([
    getProfile(),
    getPinnedProjects()
  ])

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <p>Profile not found</p>
      </div>
    )
  }

  // Group skills by category
  const skillsByCategory = profile.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof profile.skills>)

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                  <Image
                    src="https://nuvyktdqoclzyglcwukn.supabase.co/storage/v1/object/public/avatar-images//anhthe.jpg"
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-gray-600">{profile.title}</p>
                </div>
                <div className="flex space-x-4">
                  {profile.socialLinks.map((link) => {
                    const Icon = {
                      'GitHub': Github,
                      'LinkedIn': Linkedin,
                      'Twitter': Twitter,
                    }[link.platform] || Github

                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    )
                  })}
                </div>
                <div className="w-full space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="font-medium mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill.id}
                          className={`flex items-center space-x-1 ${getTechBadgeColor(skill.name)} hover:opacity-80 transition-opacity`}
                        >
                          <span>{skill.name}</span>
                          <span className="text-xs opacity-90">({skill.level}/5)</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Bio, Education, Experience */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: profile.bio }}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{edu.school}</h3>
                        <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                        </span>
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-gray-600">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Experience</h2>
              <div className="space-y-6">
                {profile.experience.length > 0 ? (
                  profile.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{exp.company}</h3>
                          <p className="text-gray-600">{exp.position}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                          </span>
                        </div>
                      </div>
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">Chưa có kinh nghiệm</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Featured Projects */}
          {pinnedProjects.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">📌</span>
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

