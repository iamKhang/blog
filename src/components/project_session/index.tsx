'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  githubUrl: string
  liveUrl?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Blog Platform",
    description: "A full-stack blog platform with user authentication, markdown support, and comment system.",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    imageUrl: "https://media.istockphoto.com/id/1265041897/vi/vec-to/nh%C3%B3m-kinh-doanh-l%C3%A0m-vi%E1%BB%87c-c%C3%B9ng-nhau-tr%C3%AAn-thi%E1%BA%BFt-k%E1%BA%BF-trang-web-m%E1%BB%8Di-ng%C6%B0%E1%BB%9Di-x%C3%A2y-d%E1%BB%B1ng-giao-di%E1%BB%87n.jpg?s=612x612&w=0&k=20&c=jX4jUpOGNScxheEbCRSK30JUUsPJP0U9pBURXMxCwI8=",
    githubUrl: "https://github.com/yourusername/blog-platform",
    liveUrl: "https://blog-platform-demo.com"
  },
  {
    id: 2,
    title: "Task Manager",
    description: "A responsive task management application with drag-and-drop functionality and team collaboration features.",
    technologies: ["Vue.js", "Firebase", "Vuex"],
    imageUrl: "https://media.istockphoto.com/id/1288486076/vi/vec-to/l%E1%BB%97i-h%E1%BB%87-th%E1%BB%91ng-trang-web-%C4%91ang-%C4%91%C6%B0%E1%BB%A3c-x%C3%A2y-d%E1%BB%B1ng-b%E1%BA%A3o-tr%C3%AC-trang-404-nh%C3%A2n-v%E1%BA%ADt-nam-c%C3%B4ng-nh%C3%A2n-nh%E1%BB%8F-x%C3%ADu.jpg?s=612x612&w=0&k=20&c=HlyBSheN2DF0ErWStHXQtun77zbd_kzVIkchLnyiIzc=",
    githubUrl: "https://github.com/yourusername/task-manager"
  },
  {
    id: 3,
    title: "E-commerce Site",
    description: "An e-commerce platform with product catalog, shopping cart, and payment integration.",
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Prisma"],
    imageUrl: "https://media.istockphoto.com/id/1358856276/vi/vec-to/c%E1%BB%ADa-s%E1%BB%95-m%C3%A1y-t%C3%ADnh-tr%C3%ACnh-duy%E1%BB%87t-retro-theo-phong-c%C3%A1ch-vaporwave-nh%E1%BB%AFng-n%C4%83m-90-v%E1%BB%9Bi-nh%C3%A3n-d%C3%A1n.jpg?s=612x612&w=0&k=20&c=xokOM9ghBWLCWU7RgR4gqkrxWL7adzwRafU3pzeEzn8=",
    githubUrl: "https://github.com/yourusername/ecommerce-site",
    liveUrl: "https://ecommerce-demo-site.com"
  }
]

export function ProjectShowcase() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null)

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-blue-900/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div key={project.id} layout>
              <Card className="h-full flex flex-col">
                <CardHeader className="p-0">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {expandedProject === project.id 
                      ? project.description 
                      : `${project.description.slice(0, 100)}...`}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-900 hover:text-[#EC8305]"
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  >
                    {expandedProject === project.id ? 'Show Less' : 'Read More'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <div className="flex justify-between w-full">
                    <Button asChild variant="outline">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                    {project.liveUrl && (
                      <Button asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}