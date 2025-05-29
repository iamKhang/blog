import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Mail, Github, Linkedin, Twitter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about me and my skills',
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

export default async function AboutMePage() {
  const profile = await getProfile()

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
                <div className="relative h-48 w-48 rounded-full overflow-hidden">
                  <Image
                    src={profile.avatar}
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
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{skill.name}</span>
                          <span className="text-xs">({skill.level}/5)</span>
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
                {profile.experience.map((exp) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

