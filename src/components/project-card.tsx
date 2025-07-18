'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Pin, Calendar } from "lucide-react"
import { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  
  const timeAgo = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return postDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card
      className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white cursor-pointer"
      onClick={() => router.push(`/projects/${project.slug}`)}
    >
      <div className="relative">
        {/* 3:2 Aspect Ratio Image */}
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {project.isPinned && (
            <Badge className="bg-yellow-500/90 text-white border-0 text-xs">
              <Pin className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge
            className={`border-0 text-xs ${
              project.status ? "bg-green-500/90 text-white" : "bg-orange-500/90 text-white"
            }`}
          >
            {project.status ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {project.title}
        </CardTitle>

        <p className="text-gray-600 line-clamp-2 mb-3 text-sm">{project.excerpt}</p>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 3).map((tech: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                {tech.trim()}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.techStack.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-1" />
          {timeAgo(project.createdAt)}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-500">
            <Eye size={14} />
            <span className="text-xs">{project.views}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Heart size={14} className={project.isLikedByUser ? "fill-red-500 text-red-500" : ""} />
            <span className="text-xs">{project.likes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 