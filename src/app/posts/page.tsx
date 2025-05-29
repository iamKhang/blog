"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Heart, Calendar, Tag, Clock } from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  views: number;
  likes: number;
  isPinned: boolean;
  createdAt: string;
  slug: string;
  tags: string[];
  series?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

const PostCard = ({ post }: { post: Post }) => {
  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="group flex flex-col h-full hover:shadow-lg transition-all duration-300 border border-gray-100">
      <Link href={`/posts/${post.slug}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative overflow-hidden">
          {post.coverImage ? (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <span className="text-gray-400 text-lg font-medium">No Image</span>
            </div>
          )}
          {post.series && (
            <Badge className="absolute top-2 left-2 bg-blue-500/90 hover:bg-blue-600/90">
              {post.series.title}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <CardTitle className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </CardTitle>
          <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
            {post.excerpt}
          </p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            {timeAgo(post.createdAt)}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between items-center p-4 border-t bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <Eye size={16} />
            <span className="text-sm">{post.views}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Heart size={16} />
            <span className="text-sm">{post.likes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const LoadingCard = () => (
  <Card className="flex flex-col h-full">
    <CardHeader className="p-0">
      <div className="w-full h-48 bg-gray-200 animate-pulse" />
    </CardHeader>
    <CardContent className="flex-grow p-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </CardContent>
    <CardFooter className="flex justify-between p-4 border-t">
      <div className="flex space-x-4">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardFooter>
  </Card>
);

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 8;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/posts/get-all?page=${currentPage}&limit=${postsPerPage}&published=true`
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.metadata.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const pinnedPosts = posts.filter((post) => post.isPinned);
  const regularPosts = posts.filter((post) => !post.isPinned);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Blog Posts</h1>

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-yellow-500">📌</span> Featured Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Latest Posts</h2>
          {regularPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage((prev) => prev - 1);
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (pageNumber > totalPages) return null;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNumber}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage((prev) => prev + 1);
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
