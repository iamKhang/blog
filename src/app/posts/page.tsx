'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, Heart } from 'lucide-react'

// Mock data for blog posts
const posts = Array(20).fill(null).map((_, i) => ({
  id: i + 1,
  title: `Blog Post ${i + 1}`,
  description: 'This is a short description of the blog post. It provides a brief overview of the content.',
  image: `https://picsum.photos/seed/post${i + 1}/300/200`, // URL ngẫu nhiên từ Picsum dựa trên seed
  views: Math.floor(Math.random() * 1000),
  likes: Math.floor(Math.random() * 100),
  isPinned: i < 2,
  isNew: i >= 2 && i < 5
}));


interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  views: number;
  likes: number;
  isPinned: boolean;
  isNew: boolean;
}

const PostCard = ({ post }: { post: Post }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="p-0">
      <Link href={`/posts/${post.id}`}>
        <Image src={post.image} alt={post.title} width={300} height={200} className="w-full h-48 object-cover" />
      </Link>
    </CardHeader>
    <CardContent className="flex-grow p-4">
      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.description}</p>
      <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
        <Link href={`/posts/${post.id}`}>Read Post</Link>
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
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6
  const totalPages = Math.ceil(posts.length / postsPerPage)

  const pinnedPosts = posts.filter(post => post.isPinned)
  const newPosts = posts.filter(post => post.isNew)
  const allPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

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
          {allPosts.map(post => (
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