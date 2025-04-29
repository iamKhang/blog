"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, GripVertical, Plus, Search, X } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  orderInSeries: number | null;
}

interface Series {
  id: string;
  title: string;
  description: string;
  posts: Post[];
}

export default function ManageSeriesPostsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [availablePosts, setAvailablePosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { id: seriesId } = use(params);

  // Fetch series data
  const { data: series, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: async () => {
      const response = await fetch(`/api/series/by-id/${seriesId}`);
      if (!response.ok) throw new Error("Failed to fetch series");
      return response.json();
    },
  });

  // Set posts when series data is loaded
  useEffect(() => {
    if (series?.posts) {
      // Sort posts by orderInSeries
      const sortedPosts = [...series.posts].sort((a, b) => {
        if (a.orderInSeries === null) return 1;
        if (b.orderInSeries === null) return -1;
        return a.orderInSeries - b.orderInSeries;
      });
      
      // Ensure all posts have an orderInSeries value
      const postsWithOrder = sortedPosts.map((post, index) => ({
        ...post,
        orderInSeries: post.orderInSeries || index + 1,
      }));
      
      setPosts(postsWithOrder);
    }
  }, [series]);

  // Fetch available posts (posts not in this series)
  const { data: allPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", "all"],
    queryFn: async () => {
      const response = await fetch(`/api/posts/get-all?limit=100`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  // Filter available posts
  useEffect(() => {
    if (allPosts?.posts && series) {
      const seriesPostIds = new Set(series.posts.map((post: Post) => post.id));
      const filtered = allPosts.posts.filter(
        (post: Post) => !seriesPostIds.has(post.id)
      );
      setAvailablePosts(filtered);
    }
  }, [allPosts, series]);

  // Filter available posts by search term
  const filteredAvailablePosts = availablePosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(posts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update orderInSeries values
    const updatedItems = items.map((item, index) => ({
      ...item,
      orderInSeries: index + 1,
    }));

    setPosts(updatedItems);
  };

  // Add a post to the series
  const handleAddPost = (post: Post) => {
    const newPosts = [
      ...posts,
      {
        ...post,
        orderInSeries: posts.length + 1,
      },
    ];
    setPosts(newPosts);
    setIsAddDialogOpen(false);
  };

  // Remove a post from the series
  const handleRemovePost = (postId: string) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    // Update orderInSeries values
    const updatedPosts = newPosts.map((post, index) => ({
      ...post,
      orderInSeries: index + 1,
    }));
    setPosts(updatedPosts);
  };

  // Save changes to the series
  const updateSeriesPostsMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      try {
        const postsData = posts.map((post) => ({
          id: post.id,
          orderInSeries: post.orderInSeries,
        }));

        const response = await fetch(`/api/series/by-id/${seriesId}/posts`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            posts: postsData,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update series posts");
        }

        return response.json();
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Series posts updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update series posts",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSeriesPostsMutation.mutate();
  };

  if (isLoadingSeries || isLoadingPosts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Manage Posts in Series: {series?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Posts in this Series</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Post to Series</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="mb-4">
                    <Label htmlFor="search">Search Posts</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by title..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAvailablePosts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center">
                            No posts available
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAvailablePosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleAddPost(post)}
                              >
                                Add
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="posts">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {posts.length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-muted-foreground">
                        No posts in this series yet. Add some posts to get started.
                      </p>
                    </div>
                  ) : (
                    posts.map((post, index) => (
                      <Draggable
                        key={post.id}
                        draggableId={post.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-3 border rounded-md bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium">{post.title}</p>
                                <p className="text-sm text-gray-500 truncate max-w-md">
                                  {post.excerpt}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                                Order: {post.orderInSeries}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemovePost(post.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/series")}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
