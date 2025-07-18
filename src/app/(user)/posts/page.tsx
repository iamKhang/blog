"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, Heart, Clock, BookOpen, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  title: string
  excerpt: string
  coverImage: string | null
  views: number
  likes: number
  isLikedByUser: boolean
  isPinned: boolean
  createdAt: string
  slug: string
  tags: string[]
  series?: {
    id: string
    title: string
    slug: string
  } | null
}

interface SeriesWithCount {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
  }
}

const PostCard = ({ post }: { post: Post }) => {
  const timeAgo = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return postDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white flex flex-col h-full">
      <div className="relative">
        {/* 3:2 Aspect Ratio Image */}
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {post.isPinned && (
            <Badge className="bg-yellow-500/90 text-white border-0 text-xs">
              <Pin className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {post.series && <Badge className="bg-blue-500/90 text-white border-0 text-xs">{post.series.title}</Badge>}
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </CardTitle>

        <p className="text-gray-600 line-clamp-2 mb-3 text-sm">{post.excerpt}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          {timeAgo(post.createdAt)}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-500">
            <Eye size={14} />
            <span className="text-xs">{post.views}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Heart size={14} className={post.isLikedByUser ? "fill-red-500 text-red-500" : ""} />
            <span className="text-xs">{post.likes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const SeriesCard = ({ series }: { series: SeriesWithCount }) => (
  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white flex flex-col h-full">
    <div className="relative">
      {/* 3:2 Aspect Ratio Image */}
      <div className="relative w-full aspect-[3/2] overflow-hidden">
        <Image
          src={series.coverImage || "/placeholder.svg?height=400&width=600"}
          alt={series.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      {/* Series badge */}
      <div className="absolute top-3 left-3">
        <Badge className="bg-purple-500/90 text-white border-0 text-xs">
          <BookOpen className="w-3 h-3 mr-1" />
          Series
        </Badge>
      </div>
    </div>

    <CardContent className="p-4 flex-grow">
      <CardTitle className="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
        <Link href={`/series/${series.slug}`}>{series.title}</Link>
      </CardTitle>

      <p className="text-gray-600 line-clamp-2 mb-3 text-sm">{series.description}</p>
    </CardContent>

    <CardFooter className="flex justify-between items-center p-4 pt-0">
      <div className="flex items-center space-x-1 text-gray-500">
        <BookOpen size={14} />
        <span className="text-sm">{series._count.posts} posts</span>
      </div>
      <Button asChild variant="outline" size="sm" className="text-xs bg-transparent">
        <Link href={`/series/${series.slug}`}>View Series</Link>
      </Button>
    </CardFooter>
  </Card>
)

const LoadingCard = () => (
  <Card className="overflow-hidden">
    <div className="relative w-full aspect-[3/2] bg-gray-200 animate-pulse" />
    <CardContent className="p-4">
      <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardContent>
    <CardFooter className="flex justify-between p-4 pt-0">
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      <div className="flex space-x-3">
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardFooter>
  </Card>
)

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [series, setSeries] = useState<SeriesWithCount[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const postsPerPage = 12

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [postsResponse, seriesResponse] = await Promise.all([
          fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}&published=true`),
          fetch("/api/series?limit=6"),
        ])

        if (!postsResponse.ok) throw new Error("Failed to fetch posts")
        if (!seriesResponse.ok) throw new Error("Failed to fetch series")

        const postsData = await postsResponse.json()
        const seriesData = await seriesResponse.json()

        setPosts(postsData.posts)
        setTotalPages(postsData.metadata.totalPages)
        setSeries(seriesData.series)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  const pinnedPosts = posts.filter((post) => post.isPinned)
  const regularPosts = posts.filter((post) => !post.isPinned)

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Articles</h1>
              <p className="text-gray-600">Discover insights, tutorials, and stories</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span>{posts.length} articles</span>
            </div>
          </div>
        </div>

        {/* Featured/Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                <Pin className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
          </div>

          {regularPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {regularPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                              setCurrentPage((prev) => prev - 1)
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                        if (pageNumber > totalPages) return null
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNumber}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(pageNumber)
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) {
                              setCurrentPage((prev) => prev + 1)
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500">Check back later for new content!</p>
            </div>
          )}
        </section>

        {/* Series Section */}
        {series.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Series</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
