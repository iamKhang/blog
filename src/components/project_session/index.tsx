'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import type { Project, ProjectsResponse } from '@/types/project'

export function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/projects?page=1&limit=4')

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()

        // Kiểm tra cấu trúc dữ liệu trả về
        if (!data || !data.projects || !Array.isArray(data.projects)) {
          throw new Error('Invalid data structure returned from API')
        }

        setProjects(data.projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError(error instanceof Error ? error.message : 'Unknown error occurred')
        // Đặt mảng rỗng để tránh lỗi khi render
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
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </section>
    )
  }

  // Hiển thị thông báo lỗi nếu có
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

  // Kiểm tra dữ liệu trước khi render
  const filteredProjects = projects && Array.isArray(projects)
    ? projects.filter(p => p && typeof p === 'object' && !p.isHidden && p.isPinned)
    : [];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects
              .slice(0, 4)
              .map((project) => (
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
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No projects found. Add some projects to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}