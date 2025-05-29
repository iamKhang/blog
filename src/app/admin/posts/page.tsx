'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  isPinned: boolean;
  isHidden: boolean;
  createdAt: string;
  tags: string[];
}

export default function PostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: async () => {
      const response = await fetch(
        `/api/posts/get-all?page=${page}&limit=${limit}&search=${search}`
      );
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const posts: Post[] = data?.posts || [];
  const metadata = data?.metadata;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button onClick={() => router.push("/admin/posts/add-post")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400">Không có bài viết nào</TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags && post.tags.length > 0 ? (
                          post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No tags</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!post.isHidden && (
                          <Badge variant="default">Published</Badge>
                        )}
                        {post.isPinned && <Badge variant="secondary">Pinned</Badge>}
                        {post.isHidden && (
                          <Badge variant="destructive">Hidden</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/posts/edit-post/${post.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/posts/${post.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, metadata?.total || 0)} of{" "}
              {metadata?.total || 0} posts
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === metadata?.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}