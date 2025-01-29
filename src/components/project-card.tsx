'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Project } from "@/types/project" // Bạn nên tạo file types riêng

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showAllTech, setShowAllTech] = useState(false);
  const router = useRouter();
  const hiddenCount = project.technologies.length - 4;

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
              {project.technologies.map((tech) => (
                <div 
                  key={tech.id} 
                  className="h-5 flex-shrink-0 hover:scale-105 transition-transform"
                >
                  <img 
                    src={tech.url}
                    alt={tech.name}
                    className="h-full w-auto"
                    style={{ maxWidth: '100px' }}
                  />
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

        <div className="flex items-center justify-between mt-auto">
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-900 hover:text-[#EC8305]"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            Read More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {project.githubUrl && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 