'use client'

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, BookOpen, ChevronLeft, ChevronRight, Loader2, Heart } from 'lucide-react';
import { PostContent } from "@/components/PostContent";
import { useParams } from "next/navigation";
import { useAuthStore } from '@/store/useAuthStore';

interface SeriesPost {
  id: string;
  title: string;
  slug: string;
  orderInSeries: number;
}

interface Series {
  id: string;
  title: string;
  slug: string;
  posts: SeriesPost[];
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  published: boolean;
  isPinned: boolean;
  isHidden: boolean;
  views: number;
  likes: number;
  isLikedByUser: boolean;
  tags: string[];
  series: Series | null;
  createdAt: string;
  updatedAt: string;
}

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const viewCountedRef = useRef(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) {
        setError('Invalid post URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/posts/${params.slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load post');
    }

        setPost(data);
  } catch (error) {
        console.error('Error fetching post:', error);
        setError(error instanceof Error ? error.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  // Tăng lượt xem chỉ một lần khi component mount
  useEffect(() => {
    const incrementView = async () => {
      if (!params.slug || viewCountedRef.current) return;

      try {
        const response = await fetch(`/api/posts/${params.slug}/view`, {
          method: 'POST',
        });

        if (response.ok) {
          viewCountedRef.current = true;
          // Cập nhật lượt xem trong state
          setPost(prev => prev ? { ...prev, views: prev.views + 1 } : null);
        }
      } catch (error) {
        console.error('Error incrementing view:', error);
      }
    };

    incrementView();
  }, [params.slug]);

  // Hàm xử lý like/unlike
  const handleLike = async () => {
    if (!isAuthenticated || !post || isLiking) {
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(`/api/posts/${params.slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => prev ? {
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

  if (error || !post) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error || 'Post not found'}</p>
            <p className="text-sm text-gray-500 mt-2">
              The post you're looking for might not exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Cover Image */}
      <div className="relative w-full h-[40vh] min-h-[400px] bg-navy-900">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-20"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent" />
        <div className="container relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-12 content-post">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300">
              <time className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.createdAt), "dd/MM/yyyy")}
              </time>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views} lượt xem
              </div>
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${post.isLikedByUser ? 'fill-red-500 text-red-500' : ''}`} />
                {post.likes} lượt thích
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {/* Series Navigation (if post is part of a series) */}
          {post.series && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-blue-800 dark:text-blue-300">
                  Part of series:{" "}
                  <Link
                    href={`/series/${post.series.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {post.series.title}
                  </Link>
                </h3>
              </div>

              {post.series.posts.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-col space-y-2">
                    {post.series.posts.map((seriesPost: SeriesPost) => (
                      <div
                        key={seriesPost.id}
                        className={`flex items-center ${
                          seriesPost.slug === post.slug
                            ? "bg-blue-100 dark:bg-blue-800/30 font-medium"
                            : "hover:bg-blue-100/50 dark:hover:bg-blue-800/20"
                        } rounded p-2`}
                      >
                        <span className="w-8 text-center text-sm text-blue-600 dark:text-blue-400">
                          {seriesPost.orderInSeries}.
                        </span>
                        {seriesPost.slug === post.slug ? (
                          <span className="flex-1">{seriesPost.title}</span>
                        ) : (
                          <Link
                            href={`/posts/${seriesPost.slug}`}
                            className="flex-1 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            {seriesPost.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous/Next Navigation */}
              {post.series.posts.length > 1 && (
                <div className="flex justify-between mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
                  {(() => {
                    const currentIndex = post.series.posts.findIndex(
                      (p: SeriesPost) => p.slug === post.slug
                    );
                    const prevPost = currentIndex > 0
                      ? post.series.posts[currentIndex - 1]
                      : null;
                    const nextPost = currentIndex < post.series.posts.length - 1
                      ? post.series.posts[currentIndex + 1]
                      : null;

                    return (
                      <>
                        {prevPost ? (
                          <Link
                            href={`/posts/${prevPost.slug}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous: {prevPost.title}
                          </Link>
                        ) : (
                          <span></span>
                        )}

                        {nextPost ? (
                          <Link
                            href={`/posts/${nextPost.slug}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Next: {nextPost.title}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        ) : (
                          <span></span>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <PostContent content={post.content} />

          {/* Tags */}
          <div className="mt-8 pt-8 border-t dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {tag}
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
              <span>{post.views} lượt xem</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`flex items-center gap-2 min-w-[140px] ${
                post.isLikedByUser ? 'bg-red-50 border-red-200 text-red-600' : ''
              }`}
              onClick={handleLike}
              disabled={!isAuthenticated || isLiking}
            >
              <Heart className={`w-5 h-5 ${
                post.isLikedByUser ? 'fill-red-500 text-red-500' : ''
              }`} />
              <span>{post.likes} lượt thích</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

