'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Link from "next/link"

// Định nghĩa kiểu dữ liệu cho project
interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  technologies: string[]
  category: string
  status: 'completed' | 'in-progress' | 'planned'
  links: {
    github?: string
    demo?: string
    documentation?: string
  }
  stats: {
    likes: number
    views: number
  }
  isPinned: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

// Dữ liệu mẫu
const projects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features dark mode, blog section, and project showcase.",
    thumbnail: "https://cdn.vietnambiz.vn/2020/1/15/photo-1579088919332-157908891933486975461.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
    category: "Web Development",
    status: "completed",
    links: {
      github: "https://github.com/yourusername/portfolio",
      demo: "https://your-portfolio.com",
    },
    stats: {
      likes: 42,
      views: 1337
    },
    isPinned: true,
    isHidden: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15"
  },
  {
    id: "2",
    title: "Portfolio Website",
    description: "Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features dark mode, blog section, and project showcase.",
    thumbnail: "https://cdn.vietnambiz.vn/2020/1/15/photo-1579088919332-157908891933486975461.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
    category: "Web Development",
    status: "completed",
    links: {
      github: "https://github.com/yourusername/portfolio",
      demo: "https://your-portfolio.com",
    },
    stats: {
      likes: 42,
      views: 1337
    },
    isPinned: true,
    isHidden: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15"
  },
  {
    id: "3",
    title: "Portfolio Website",
    description: "Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features dark mode, blog section, and project showcase.",
    thumbnail: "https://cdn.vietnambiz.vn/2020/1/15/photo-1579088919332-157908891933486975461.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
    category: "Web Development",
    status: "completed",
    links: {
      github: "https://github.com/yourusername/portfolio",
      demo: "https://your-portfolio.com",
    },
    stats: {
      likes: 42,
      views: 1337
    },
    isPinned: true,
    isHidden: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15"
  },
  {
    id: "4",
    title: "Portfolio Website",
    description: "Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features dark mode, blog section, and project showcase.",
    thumbnail: "https://cdn.vietnambiz.vn/2020/1/15/photo-1579088919332-157908891933486975461.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
    category: "Web Development",
    status: "completed",
    links: {
      github: "https://github.com/yourusername/portfolio",
      demo: "https://your-portfolio.com",
    },
    stats: {
      likes: 42,
      views: 1337
    },
    isPinned: true,
    isHidden: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15"
  },
  // Thêm các projects khác...
]

const statusColors = {
  'completed': 'bg-green-500',
  'in-progress': 'bg-yellow-500',
  'planned': 'bg-blue-500'
}

const statusLabels = {
  'completed': 'Hoàn thành',
  'in-progress': 'Đang phát triển',
  'planned': 'Dự kiến'
}

export default function ProjectsPage() {
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
    return a.isPinned ? -1 : 1
  })

  return (
    <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Dự án của tôi</h1>
        <p className="text-xs sm:text-base text-muted-foreground">
          Tổng hợp các dự án đã và đang thực hiện
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {sortedProjects.filter(p => !p.isHidden).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [showAllTech, setShowAllTech] = useState(false)
  const [visibleTech, setVisibleTech] = useState<string[]>([])
  const [hiddenCount, setHiddenCount] = useState(0)

  useEffect(() => {
    const calculateVisibleTech = () => {
      const containerWidth = document.getElementById(`tech-${project.id}`)?.offsetWidth || 0
      let currentWidth = 0
      const tempVisible: string[] = []
      
      // Tạo element tạm để đo độ rộng của mỗi badge
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.visibility = 'hidden'
      document.body.appendChild(tempDiv)

      for (const tech of project.technologies) {
        tempDiv.innerHTML = `<span class="badge">${tech}</span>`
        const badgeWidth = tempDiv.firstChild?.getBoundingClientRect().width || 0
        
        if (currentWidth + badgeWidth < containerWidth) {
          currentWidth += badgeWidth
          tempVisible.push(tech)
        } else {
          break
        }
      }

      document.body.removeChild(tempDiv)
      
      setVisibleTech(tempVisible)
      setHiddenCount(project.technologies.length - tempVisible.length)
    }

    calculateVisibleTech()
    window.addEventListener('resize', calculateVisibleTech)
    return () => window.removeEventListener('resize', calculateVisibleTech)
  }, [project.id, project.technologies])

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9]">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="object-cover w-full h-full rounded-t-lg"
        />
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-sm text-white px-1.5 py-0.5",
            statusColors[project.status]
          )}
        >
          {statusLabels[project.status]}
        </Badge>
      </div>

      <CardHeader className="space-y-0.5 sm:space-y-1 p-2 sm:p-4">
        <CardTitle className="text-sm sm:text-lg md:text-xl line-clamp-1">
          {project.title}
        </CardTitle>
        <CardDescription className="text-[10px] sm:text-sm line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow p-2 sm:p-4 pt-0">
        <div 
          id={`tech-${project.id}`}
          className="flex flex-wrap gap-1 sm:gap-2"
        >
          {visibleTech.map((tech) => (
            <Badge 
              key={tech} 
              variant="outline"
              className="text-[10px] sm:text-xs px-1 py-0 sm:px-2 sm:py-0.5"
            >
              {tech}
            </Badge>
          ))}
          {hiddenCount > 0 && (
            <Badge 
              variant="outline"
              className="text-[10px] sm:text-xs px-1 py-0 sm:px-2 sm:py-0.5"
            >
              +{hiddenCount}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-sm">
          <div className="flex items-center">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
            {project.stats.likes}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
            {project.stats.views}
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          className="text-[10px] sm:text-sm h-6 sm:h-8 px-2 sm:px-3"
          asChild
        >
          <Link href={`/projects/${project.id}`}>
            View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
