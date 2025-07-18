"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, Heart, Calendar, Pin, Code } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  excerpt: string
  description: string
  thumbnail: string
  techStack: string[]
  status: boolean
  views: number
  likes: number
  isLikedByUser: boolean
  isPinned: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectsResponse {
  projects: Project[]
  metadata: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter()

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
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white flex flex-col h-full cursor-pointer"
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
  )
}

const LoadingCard = () => (
  <Card className="overflow-hidden">
    <div className="relative w-full aspect-[3/2] bg-gray-200 animate-pulse" />
    <CardContent className="p-4">
      <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardContent>
    <CardFooter className="flex justify-between p-4 pt-0">
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      <div className="flex space-x-3">
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardFooter>
  </Card>
)

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/projects?page=${currentPage}&limit=12`)
        const data: ProjectsResponse = await response.json()
        setProjects(data.projects)
        setTotalPages(data.metadata.totalPages)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const pinnedProjects = projects.filter((p) => p.isPinned && !p.isHidden)
  const regularProjects = projects.filter((p) => !p.isPinned && !p.isHidden)

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Projects</h1>
              <p className="text-gray-600">Showcase of my development work and experiments</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span>{projects.length} projects</span>
            </div>
          </div>
        </div>

        {/* Featured/Pinned Projects */}
        {pinnedProjects.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                <Pin className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pinnedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Projects */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Projects</h2>
          </div>

          {regularProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                              handlePageChange(currentPage - 1)
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                        if (pageNumber > totalPages) return null
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNumber}
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(pageNumber)
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) {
                              handlePageChange(currentPage + 1)
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Code className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">Check back later for new projects!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
