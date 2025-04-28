'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import type { Project, ProjectsResponse } from '@/types/project'

export function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?page=1&limit=4')
        const data: ProjectsResponse = await response.json()
        setProjects(data.projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
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

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects && projects.length > 0 ? (
            projects
              .filter(p => !p.isHidden && p.isPinned)
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