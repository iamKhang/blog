'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Eye, ThumbsUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: number
  views: number
  likes: number
  category: string
  imageUrl: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt: "Learn how to set up your first Next.js project and understand its core concepts.",
    date: "2023-06-15",
    readTime: 5,
    views: 1200,
    likes: 89,
    category: "Web Development",
    imageUrl: "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 2,
    title: "Mastering React Hooks",
    excerpt: "Dive deep into React Hooks and learn how to use them effectively in your projects.",
    date: "2023-06-01",
    readTime: 8,
    views: 1500,
    likes: 120,
    category: "React",
    imageUrl: "https://images.pexels.com/photos/2825749/pexels-photo-2825749.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    excerpt: "Explore best practices for creating robust and scalable APIs using Node.js and Express.",
    date: "2023-05-20",
    readTime: 10,
    views: 980,
    likes: 75,
    category: "Backend",
    imageUrl: "https://images.pexels.com/photos/2179205/pexels-photo-2179205.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
]

export function BlogSection() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

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
          {blogPosts.map((post) => (
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
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <Badge className="mb-2">{post.category}</Badge>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                    <Link href={`/blog/${post.id}`}>
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
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}