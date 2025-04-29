"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { Loader2, ImagePlus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Category, Tag } from "@prisma/client";
import { TinyEditor } from "@/components/TinyEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  params: {
    id: string;
  };
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tags: z.array(z.string()),
  seriesId: z.string().nullable(),
  orderInSeries: z.number().int().nullable(),
});

type FormData = z.infer<typeof formSchema>;



export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { id: postId } = use(params);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch post data
  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/by-id/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
  });

  // Fetch series data
  const { data: seriesData = { series: [] } } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const response = await fetch("/api/series?includeInactive=false");
      if (!response.ok) throw new Error("Failed to fetch series");
      return response.json();
    },
  });

  // Set form values when post data is loaded
  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("excerpt", post.excerpt);
      setValue("content", post.content);
      setValue("isPinned", post.isPinned);
      setValue("isHidden", post.isHidden);
      setValue(
        "categories",
        post.categories.map((cat: Category) => cat.id)
      );
      setValue(
        "tags",
        post.tags.map((tag: Tag) => tag.id)
      );
      setValue("seriesId", post.seriesId);
      setValue("orderInSeries", post.orderInSeries);
      if (post.coverImage) {
        setCoverImagePreview(post.coverImage);
      }
    }
  }, [post, setValue]);

  // Fetch categories and tags
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      return response.json();
    },
  });

  const handleImageUpload = async (blob: Blob): Promise<string> => {
    const file = new File([blob], `image-${Date.now()}.png`, {
      type: blob.type,
    });
    try {
      const imageUrl = await uploadFile(file, "post-images");
      if (!imageUrl) {
        throw new Error("No image URL returned");
      }
      return imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
  };

  const handleCoverImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      try {
        const imageUrl = await handleImageUpload(file);
        setCoverImagePreview(imageUrl);
      } catch (uploadError) {
        console.error("Cover image upload error:", uploadError);
        toast({
          title: "Error",
          description:
            uploadError instanceof Error
              ? uploadError.message
              : "Failed to upload cover image",
          variant: "destructive",
        });
      }
    }
  };

  const updatePostMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsSubmitting(true);
      try {
        let imageUrl = coverImage
          ? await handleImageUpload(coverImage)
          : post.coverImage;

        const slug = slugify(data.title);

        const response = await fetch(`/api/posts/by-id/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            slug,
            coverImage: imageUrl,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update post");
        }

        return response.json();
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/admin/posts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updatePostMutation.mutate(data);
  };

  if (isLoadingPost) {
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
          <CardTitle className="text-2xl font-bold">Edit Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </div>
              {coverImagePreview && (
                <div className="relative w-full h-48 mt-4">
                  <Image
                    src={coverImagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt")}
                placeholder="Enter post excerpt"
              />
              {errors.excerpt && (
                <p className="text-sm text-red-500">{errors.excerpt.message}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TinyEditor
                    value={value}
                    onEditorChange={onChange}
                    imagesUploadHandler={async (blobInfo) => {
                      return await handleImageUpload(blobInfo.blob());
                    }}
                  />
                )}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => {
                  const selectedCategories = categories.filter((category: Category) =>
                    field.value?.includes(category.id)
                  );

                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category: Category) => (
                          <Badge
                            key={category.id}
                            variant="default"
                            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                          >
                            {category.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(
                                  field.value?.filter((id) => id !== category.id) || []
                                );
                              }}
                            />
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {categories
                          .filter(
                            (category: Category) => !field.value?.includes(category.id)
                          )
                          .map((category: Category) => (
                            <Badge
                              key={category.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                field.onChange([...(field.value || []), category.id]);
                              }}
                            >
                              {category.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  );
                }}
              />
              {errors.categories && (
                <p className="text-sm text-red-500">{errors.categories.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => {
                  const selectedTags = tags.filter((tag: Tag) =>
                    field.value?.includes(tag.id)
                  );

                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag: Tag) => (
                          <Badge
                            key={tag.id}
                            variant="default"
                            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                          >
                            {tag.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(
                                  field.value?.filter((id) => id !== tag.id) || []
                                );
                              }}
                            />
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {tags
                          .filter((tag: Tag) => !field.value?.includes(tag.id))
                          .map((tag: Tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                field.onChange([...(field.value || []), tag.id]);
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            {/* Series Selection */}
            <div className="space-y-2">
              <Label htmlFor="seriesId">Series (Optional)</Label>
              <Controller
                name="seriesId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value === "" ? null : value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a series (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {seriesData.series.map((series: any) => (
                        <SelectItem key={series.id} value={series.id}>
                          {series.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Order in Series */}
            <div className="space-y-2">
              <Label htmlFor="orderInSeries">Order in Series (Optional)</Label>
              <Controller
                name="orderInSeries"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter order number"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : parseInt(value, 10));
                    }}
                    disabled={!field.value}
                  />
                )}
              />
              <p className="text-sm text-gray-500">
                Leave empty if not part of a series
              </p>
            </div>

            {/* Post Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPinned">Pinned</Label>
                <Controller
                  name="isPinned"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isHidden">Hidden</Label>
                <Controller
                  name="isHidden"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}