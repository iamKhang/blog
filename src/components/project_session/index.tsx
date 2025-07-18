'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Pin } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/types/project'
import LoadingSpinner from '@/components/ui/loading-spinner'

export function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/projects?page=1&limit=3')

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()

        // Kiểm tra cấu trúc dữ liệu trả về
        if (!data || !data.projects || !Array.isArray(data.projects)) {
          throw new Error('Invalid data structure returned from API')
        }

        // Lọc ra các project được ghim và sắp xếp theo thời gian tạo mới nhất
        const pinnedProjects = data.projects
          .filter((project: Project) => project.isPinned && !project.isHidden)
          .sort((a: Project, b: Project) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3)

        setProjects(pinnedProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError(error instanceof Error ? error.message : 'Unknown error occurred')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading projects...
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner 
              size={100} 
              className="text-blue-600" 
            />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Featured Projects
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-600">
              Unable to load projects. Please try again later.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
              <Pin className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900">Featured Projects</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Showcase of my most notable development work and experiments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Pin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured projects</h3>
              <p className="text-gray-500">Check back later for featured projects!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}