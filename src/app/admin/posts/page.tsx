'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { PlusCircle, Pin, PinOff, MoreVertical, Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Post {
  id: string
  title: string
  content: string
  isPinned: boolean
  isHidden: boolean
  lastUpdated: Date
}

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework that makes building fast and scalable web applications a breeze. In this post, we\'ll explore the basics of Next.js and how to set up your first project.',
    isPinned: true,
    isHidden: false,
    lastUpdated: new Date('2023-06-15T10:30:00'),
  },
  {
    id: '2',
    title: 'Mastering React Hooks',
    content: 'React Hooks have revolutionized the way we write React components. This comprehensive guide will take you through all the built-in hooks and show you how to create your own custom hooks.',
    isPinned: false,
    isHidden: false,
    lastUpdated: new Date('2023-06-10T14:45:00'),
  },
  {
    id: '3',
    title: 'CSS-in-JS: Styled Components vs. Emotion',
    content: 'CSS-in-JS libraries have gained popularity in recent years. In this comparison, we\'ll look at two of the most popular options: Styled Components and Emotion. We\'ll explore their similarities, differences, and use cases.',
    isPinned: false,
    isHidden: true,
    lastUpdated: new Date('2023-06-05T09:15:00'),
  },
  {
    id: '4',
    title: 'GraphQL vs REST: Choosing the Right API Architecture',
    content: 'When building modern web applications, choosing the right API architecture is crucial. This post compares GraphQL and REST, discussing their pros and cons to help you make an informed decision for your next project.',
    isPinned: false,
    isHidden: false,
    lastUpdated: new Date('2023-06-01T16:20:00'),
  },
  {
    id: '5',
    title: 'Optimizing React Performance',
    content: 'Performance is key in providing a great user experience. Learn about various techniques to optimize your React applications, including code splitting, memoization, and efficient state management.',
    isPinned: true,
    isHidden: false,
    lastUpdated: new Date('2023-05-28T11:00:00'),
  },
  {
    id: '6',
    title: 'Introduction to TypeScript',
    content: 'TypeScript adds static typing to JavaScript, making it easier to write and maintain large-scale applications. This introductory post covers the basics of TypeScript and how to integrate it into your projects.',
    isPinned: false,
    isHidden: false,
    lastUpdated: new Date('2023-05-20T13:30:00'),
  },
]

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return b.lastUpdated.getTime() - a.lastUpdated.getTime()
      }
      return a.isPinned ? -1 : 1
    })
  }, [posts])

  const togglePin = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isPinned: !post.isPinned } : post
    ))
  }

  const toggleHidden = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isHidden: !post.isHidden } : post
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Manage Posts</h1>
        <Button asChild className="bg-[#EC8305] hover:bg-[#D97704]">
          <Link href="/admin/posts/add-post">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Post
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPosts.map((post) => (
            <TableRow key={post.id} className={post.isHidden ? 'opacity-60' : ''}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => togglePin(post.id)}
                  >
                    {post.isPinned ? (
                      <Pin className="h-4 w-4 text-blue-900" />
                    ) : (
                      <PinOff className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                  {post.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {post.isPinned && <Badge variant="secondary">Pinned</Badge>}
                  {post.isHidden && <Badge variant="outline">Hidden</Badge>}
                  {!post.isPinned && !post.isHidden && <Badge variant="default">Published</Badge>}
                </div>
              </TableCell>
              <TableCell>{format(post.lastUpdated, 'MMM d, yyyy HH:mm')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/posts/edit/${post.id}`}>
                        Update
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleHidden(post.id)}>
                      {post.isHidden ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Unhide</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          <span>Hide</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}