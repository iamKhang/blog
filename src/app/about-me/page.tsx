'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, FileText } from 'lucide-react'

const skills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "SQL", "Git", "Docker"
]

const experiences = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    period: "2020 - Present",
    description: "Lead frontend development for multiple high-traffic web applications. Implemented modern React practices and improved performance by 40%."
  },
  {
    title: "Full Stack Developer",
    company: "Innovative Startups Co.",
    period: "2018 - 2020",
    description: "Developed and maintained full-stack applications using MERN stack. Collaborated with cross-functional teams to deliver projects on time."
  },
  {
    title: "Junior Web Developer",
    company: "Digital Agency XYZ",
    period: "2016 - 2018",
    description: "Created responsive websites for clients across various industries. Gained proficiency in frontend technologies and best practices."
  }
]

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"]
  },
  {
    title: "Task Management App",
    description: "A Trello-like application for team collaboration and project management.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL"]
  },
  {
    title: "Weather Forecast Dashboard",
    description: "An interactive weather dashboard with data visualization.",
    technologies: ["React", "D3.js", "OpenWeatherMap API"]
  }
]

export default function AboutMePage() {
  return (
    <div className="min-h-screen bg-white p-8 py-3">
      <header className="mb-12 text-center">
        <Image
          src="/images/profile.jpg"
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2 text-blue-900">Lê Hoàng Khang</h1>
        <p className="text-xl text-gray-600 mb-4">Software Engineer</p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon">
            <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Link href="mailto:your.email@example.com">
              <Mail className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">About Me</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700">
              I am a passionate and experienced frontend developer with a strong background in creating responsive and user-friendly web applications. With over 5 years of experience in the industry, I specialize in React and Next.js development, always striving to write clean, efficient, and maintainable code.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Work Experience</h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{exp.title}</CardTitle>
                <p className="text-sm text-gray-500">{exp.company} | {exp.period}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

