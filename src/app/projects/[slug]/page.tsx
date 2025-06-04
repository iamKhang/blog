'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Github, ExternalLink, Heart, Eye, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { PostContent } from '@/components/PostContent'
import { useAuthStore } from '@/store/useAuthStore'

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

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const [viewCounted, setViewCounted] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.slug) {
        console.error('No slug provided');
        setError('Invalid project URL');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching project with slug:', params.slug);
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/projects/${params.slug}`);
        const data = await response.json();
        
        console.log('API Response:', {
          status: response.status,
          ok: response.ok,
          data: data
        });

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load project');
        }

        if (!data || !data.id) {
          throw new Error('Invalid project data received');
        }

        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.slug]);

  // Tăng lượt xem chỉ một lần khi component mount
  useEffect(() => {
    const incrementView = async () => {
      if (!params.slug || viewCounted) return;

      try {
        const response = await fetch(`/api/projects/${params.slug}/view`, {
          method: 'POST',
        });

        if (response.ok) {
          setViewCounted(true);
          // Cập nhật lượt xem trong state
          setProject(prev => prev ? { ...prev, views: prev.views + 1 } : null);
        }
      } catch (error) {
        console.error('Error incrementing view:', error);
      }
    };

    incrementView();
  }, [params.slug, viewCounted]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated || !project || isLiking) {
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(`/api/projects/${params.slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setProject(prev => prev ? {
          ...prev,
          likes: data.likesCount,
          isLikedByUser: data.isLiked
        } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error || 'Project not found'}</p>
            <p className="text-sm text-gray-500 mt-2">
              The project you're looking for might not exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Thumbnail */}
      <div className="relative w-full h-[40vh] min-h-[400px] bg-navy-900">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover opacity-20"
          priority
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent" />
        <div className="container relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-12">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {project.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300">
              <time className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(project.createdAt), "dd/MM/yyyy")}
              </time>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {project.views} lượt xem
              </div>
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${project.isLikedByUser ? 'fill-red-500 text-red-500' : ''}`} />
                {project.likes} lượt thích
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {/* Status Badge */}
          <div className="mb-8">
            <Badge variant={project.status ? "default" : "secondary"}>
              {project.status ? "Completed" : "In Progress"}
            </Badge>
          </div>

          {/* Excerpt */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {project.excerpt}
            </p>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <PostContent content={project.description} />
          </div>

          {/* Tech Stack */}
          <div className="mt-8 pt-8 border-t dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="mt-8 pt-8 border-t dark:border-gray-700 flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 min-w-[140px]"
            >
              <Eye className="w-5 h-5" />
              <span>{project.views} lượt xem</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`flex items-center gap-2 min-w-[140px] ${
                project.isLikedByUser ? 'bg-red-50 border-red-200 text-red-600' : ''
              }`}
              onClick={handleLike}
              disabled={!isAuthenticated || isLiking}
            >
              <Heart className={`w-5 h-5 ${
                project.isLikedByUser ? 'fill-red-500 text-red-500' : ''
              }`} />
              <span>{project.likes} lượt thích</span>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              View Source
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Live Demo
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
} 