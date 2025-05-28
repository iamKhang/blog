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
import { Eye, Heart, Calendar, Tag } from "lucide-react";

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
  tags: string[];
}

const PostCard = ({ post }: { post: Post }) => (
  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
    <Link href={`/posts/${post.slug}`}>
      <CardHeader className="p-0">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
            <span className="text-white text-lg font-semibold">No Image</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 flex flex-col">
        <CardTitle className="text-lg mb-2 line-clamp-2 min-h-[3.5rem] hover:text-blue-600 transition-colors">
          {post.title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow min-h-[3.75rem]">
          {post.excerpt}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <Tag size={14} className="text-gray-400 mt-0.5" />
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
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
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Calendar size={14} className="mr-1" />
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </CardContent>
    </Link>
    <CardFooter className="flex justify-between items-center p-4 border-t">
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

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/posts?page=${currentPage}&limit=${postsPerPage}&published=true`
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.pages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const pinnedPosts = posts.filter((post) => post.isPinned);
  const newPosts = posts.filter(
    (post) =>
      new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              📌 Pinned Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pinnedPosts.map((post) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} />
                  <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                    Pinned
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Posts */}
        {newPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              ✨ New Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newPosts.map((post) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} />
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                    New
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Posts</h2>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {posts.map((post) => (
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
