import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Eye, Calendar } from 'lucide-react';
import { PostContent } from "@/components/PostContent";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Props {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch post");
    }

    return response.json();
  } catch (error) {
    console.error("[GET_POST]", error);
    throw new Error("Failed to fetch post");
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Cover Image */}
      <div className="relative w-full h-[40vh] min-h-[400px] bg-navy-900">
        {post.coverImage ? (
          <Image
            src={post.coverImage || "/placeholder.svg"}
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
              {post.categories.map((category: Category) => (
                <Badge 
                  key={category.id} 
                  className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 transition-colors"
                >
                  {category.name}
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
                <ThumbsUp className="w-4 h-4" />
                {post.likes} lượt thích
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {/* Content */}
          <PostContent content={post.content} />

          {/* Tags */}
          <div className="mt-8 pt-8 border-t dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: Tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {tag.name}
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
              className="flex items-center gap-2 min-w-[140px]"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{post.likes} lượt thích</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: Props) {
  if (!params?.slug) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

