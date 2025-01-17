import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TableOfContents from '@/components/TableOfContents';

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile TOC */}
      <div className="lg:hidden mb-8">
        <TableOfContents 
          content={post.content} 
          postInfo={{
            title: post.title,
            createdAt: post.createdAt
          }}
        />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8">
        <article className="post-content lg:w-[calc(100%-320px)]">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(post.createdAt), "dd/MM/yyyy")}
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-video mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          <footer className="mt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>

            {/* Post Stats */}
            <div className="flex justify-between items-center text-sm text-muted-foreground border-t mt-8 pt-4">
              <div>Lượt xem: {post.views}</div>
              <div>Lượt thích: {post.likes}</div>
            </div>
          </footer>
        </article>

        {/* Desktop TOC */}
        <aside className="hidden lg:block lg:w-[300px] lg:flex-shrink-0">
          <TableOfContents 
            content={post.content} 
            postInfo={{
              title: post.title,
              createdAt: post.createdAt
            }}
          />
        </aside>
      </div>
    </div>
  );
}

// Tạo metadata cho SEO
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
