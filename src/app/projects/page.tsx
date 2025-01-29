'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, Github, ExternalLink, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProjectCard } from "@/components/project-card"

// Updated interface to match API response
interface Technology {
  id: string
  name: string
  url: string
}

interface Project {
  id: string
  title: string
  description: string
  excerpt: string
  thumbnail: string
  technologies: Technology[]
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'
  githubUrl?: string
  demoUrl?: string
  docsUrl?: string
  views: number
  likes: number
  isPinned: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

// Thêm interface cho response API
interface ProjectsResponse {
  projects: Project[];
  metadata: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects?page=${currentPage}&limit=12`);
        const data: ProjectsResponse = await response.json();
        setProjects(data.projects);
        setTotalPages(data.metadata.totalPages);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="mb-4 sm:mb-8">
        <p className="text-xs sm:text-base text-muted-foreground">
          Tổng hợp các dự án đã và đang thực hiện
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {projects.filter(p => !p.isHidden).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
