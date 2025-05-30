'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showAllTech, setShowAllTech] = useState(false);
  const router = useRouter();
  const hiddenCount = project.techStack.length - 4;

  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.thumbnail} 
          alt={project.title} 
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105" 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <CardContent className="flex-grow p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl mb-2 line-clamp-1">
          {project.title}
        </CardTitle>
        
        <CardDescription className="mb-4 line-clamp-2 text-sm sm:text-base">
          {project.excerpt}
        </CardDescription>

        <div className="relative mb-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className={cn(
              "flex flex-wrap gap-1.5 transition-all duration-300",
              !showAllTech && "max-h-5 overflow-hidden"
            )}>
              {project.techStack.map((tech, index) => (
                <div 
                  key={index} 
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
          {!showAllTech && hiddenCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="absolute -right-1 top-0 h-5 px-2 text-xs bg-background hover:bg-background/90"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTech(true);
              }}
            >
              +{hiddenCount}
            </Button>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {project.views || 0}
          </span>
          <span className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {project.likes || 0}
          </span>
        </div>

        <Button 
          className="w-full bg-blue-900 hover:bg-blue-800"
          onClick={() => router.push(`/projects/${project.slug}`)}
        >
          Read More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
} 