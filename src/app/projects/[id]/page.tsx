'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Technology {
  id: string;
  name: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  thumbnail: string;
  technologies: Technology[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  githubUrl?: string;
  demoUrl?: string;
  docsUrl?: string;
  views: number;
  likes: number;
  isPinned: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-[400px] w-full">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="flex gap-2">
              {project.githubUrl && (
                <Button asChild variant="outline">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}
              {project.demoUrl && (
                <Button asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-6">
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

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
      </Card>
    </div>
  );
} 