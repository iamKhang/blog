"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Calendar, BookOpen } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";



interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  views: number;
  likes: number;
  createdAt: string;
  orderInSeries: number;
}

interface Series {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  posts: Post[];
}

export default function SeriesPage() {
  const params = useParams();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!params.slug) {
        setError('Invalid series URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/series/by-slug/${params.slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Series not found');
          } else {
            throw new Error('Failed to fetch series');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setSeries(data);
      } catch (error) {
        console.error('Error fetching series:', error);
        setError(error instanceof Error ? error.message : 'Failed to load series');
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <LoadingSpinner 
              size={150} 
              className="text-blue-600 scale-75 sm:scale-90 lg:scale-100 transition-transform" 
            />
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Đang tải series...
              </h2>
              <p className="text-sm md:text-base text-gray-500">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Series not found</h3>
            <p className="text-gray-500">{error || 'The series you\'re looking for might not exist or has been removed.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort posts by orderInSeries
  const sortedPosts = [...series.posts].sort((a, b) => {
    if (a.orderInSeries === null) return 1;
    if (b.orderInSeries === null) return -1;
    return a.orderInSeries - b.orderInSeries;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative w-full h-[40vh] min-h-[400px] bg-navy-900">
        {series.coverImage ? (
          <Image
            src={series.coverImage || "/placeholder.svg"}
            alt={series.title}
            fill
            className="object-cover opacity-20"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
        )}

        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {series.title}
              </h1>
              <p className="mt-4 text-xl text-gray-200">
                {series.description}
              </p>
              <div className="mt-4">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {sortedPosts.length} Posts in Series
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Posts in this Series</h2>

        <div className="space-y-6">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No posts in this series yet</p>
            </div>
          ) : (
            sortedPosts.map((post, index) => (
              <Card key={post.id} className="flex overflow-hidden">
                <div className="w-1/4 relative">
                  <Image
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-3/4 flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="mb-2">
                        Part {post.orderInSeries} of {sortedPosts.length}
                      </Badge>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center">
                          <Eye className="mr-1 h-4 w-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="mr-1 h-4 w-4" />
                          {post.likes}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read Post →
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
