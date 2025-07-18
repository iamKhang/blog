'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Eye, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '@/components/ui/loading-spinner'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  createdAt: string
  readTime: number
  views: number
  likes: number
  isLikedByUser: boolean
  tags: string[]
  coverImage: string
  slug: string
}

async function fetchPosts() {
  const response = await fetch('/api/posts?limit=3&published=true')
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  const data = await response.json()
  return data.posts
}

export function BlogSection() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['latestPosts'],
    queryFn: fetchPosts
  })

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-blue-900/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Latest Blog Posts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading posts...
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
      <section className="py-16 bg-gradient-to-b from-blue-900/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Latest Blog Posts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Failed to load posts. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-900/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Latest Blog Posts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with my latest thoughts, tutorials, and insights on web development and software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredPost(post.id)}
              onHoverEnd={() => setHoveredPost(null)}
            >
              <Link href={`/posts/${post.slug}`}>
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white cursor-pointer group">
                  <div className="relative">
                    {/* 3:2 Aspect Ratio Image */}
                    <div className="relative w-full aspect-[3/2] overflow-hidden">
                      <img 
                        src={post.coverImage || "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600"} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <CardContent className="p-4 flex-grow">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{post.excerpt}</p>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center p-4 pt-0">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime || 5} min
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye size={14} />
                        <span className="text-xs">{post.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Heart size={14} className={post.isLikedByUser ? "fill-red-500 text-red-500" : ""} />
                        <span className="text-xs">{post.likes || 0}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-[#EC8305] hover:bg-[#D97704]">
            <Link href="/posts">
              View All Posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}