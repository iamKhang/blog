'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Eye, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from '@tanstack/react-query'

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
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
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
              <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  <img 
                    src={post.coverImage || "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600"} 
                    alt={post.title} 
                    className="w-full h-48 object-cover" 
                  />
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime || 5} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views || 0}
                    </span>
                    <span className="flex items-center">
                      <Heart className={`w-4 h-4 mr-1 ${post.isLikedByUser ? 'fill-red-500 text-red-500' : ''}`} />
                      {post.likes || 0}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                    <Link href={`/posts/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
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