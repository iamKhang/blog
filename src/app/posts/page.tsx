'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, Heart } from 'lucide-react'

interface Post {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  views: number;
  likes: number;
  isPinned: boolean;
  createdAt: string;
  slug: string;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

const PostCard = ({ post }: { post: Post }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="p-0">
      <Link href={`/posts/${post.id}`}>
        <Image src={post.coverImage} alt={post.title} width={300} height={200} className="w-full h-48 object-cover" />
      </Link>
    </CardHeader>
    <CardContent className="flex-grow p-4">
      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
      <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
        <Link href={`/posts/${post.slug}`}>Read Post</Link>
      </Button>
    </CardContent>
    <CardFooter className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center space-x-2">
        <Eye size={16} />
        <span className="text-sm">{post.views}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Heart size={16} />
        <span className="text-sm">{post.likes}</span>
      </div>
    </CardFooter>
  </Card>
)

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}`)
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.metadata.totalPages)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [currentPage])

  const pinnedPosts = posts.filter(post => post.isPinned)
  const newPosts = posts.filter(post => new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Posts from the last 7 days

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Blog Posts</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Pinned Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pinnedPosts.map(post => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <Badge className="absolute top-2 right-2 bg-[#EC8305]">Pinned</Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">New Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newPosts.map(post => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <Badge className="absolute top-2 right-2 bg-green-500">New</Badge>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">All Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  )
}