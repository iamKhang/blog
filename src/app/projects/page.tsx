'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, Github, ExternalLink, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  status: boolean;
  views: number;
  likes: number;
  isPinned: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  projects: Project[];
  metadata: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();
  
  return (
    <Card className="group flex w-full overflow-hidden hover:shadow-lg transition-all duration-300 border cursor-pointer"
          onClick={() => router.push(`/projects/${project.slug}`)}>
      <div className="hidden md:block w-1/4 min-w-[180px] relative">
        <div className="relative w-full h-full min-h-[200px]">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {project.isPinned && (
          <Badge className="absolute top-2 left-2 bg-yellow-500/90 hover:bg-yellow-600/90">
            Pinned
          </Badge>
        )}
      </div>
      
      <div className="w-full md:w-3/4 flex flex-col flex-1">
        <CardHeader className="flex-grow">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
              {project.title}
            </CardTitle>
            <Badge variant={project.status ? "default" : "secondary"}>
              {project.status ? "Completed" : "In Progress"}
            </Badge>
          </div>
          
          <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
            {project.excerpt}
          </p>
          
          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.slice(0, 4).map((tech: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200">
                  {tech.trim()}
                </Badge>
              ))}
              {project.techStack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.techStack.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardFooter className="flex justify-between items-center p-4 border-t bg-gray-50/50">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>👁 {project.views}</span>
            <span>❤️ {project.likes}</span>
            <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
            Xem chi tiết <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

const LoadingCard = () => (
  <Card className="flex overflow-hidden">
    <div className="w-1/4">
      <div className="w-full h-[200px] bg-gray-200 animate-pulse" />
    </div>
    <div className="w-3/4 flex flex-col">
      <CardHeader className="flex-grow">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between p-4 border-t">
        <div className="flex space-x-4">
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardFooter>
    </div>
  </Card>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects?page=${currentPage}&limit=8`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pinnedProjects = projects.filter(p => p.isPinned && !p.isHidden);
  const regularProjects = projects.filter(p => !p.isPinned && !p.isHidden);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="flex flex-col gap-6">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Projects</h1>
        
        <p className="text-gray-600 mb-8">
          Tổng hợp các dự án đã và đang thực hiện
        </p>

        {/* Pinned Projects */}
        {pinnedProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-yellow-500">📌</span> Featured Projects
            </h2>
            <div className="flex flex-col gap-6">
              {pinnedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Projects */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Latest Projects</h2>
          {regularProjects.length > 0 ? (
            <>
              <div className="flex flex-col gap-6 mb-8">
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNumber > totalPages) return null;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNumber}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có dự án nào được công bố.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
