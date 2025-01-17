"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { Loader2, ImagePlus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.any().optional(),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tags: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const fetchCategories = async () => {
  const response = await fetch("/api/categories");
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

const fetchTags = async () => {
  const response = await fetch("/api/tags");
  if (!response.ok) throw new Error("Failed to fetch tags");
  return response.json();
};

const createCategory = async (name: string) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
};

const createTag = async (name: string) => {
  const response = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to create tag");
  return response.json();
};

const searchCategories = async (query: string) => {
  const response = await fetch(
    `/api/categories/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Failed to search categories");
  const data = await response.json();
  return data;
};

const searchTags = async (query: string) => {
  const response = await fetch(
    `/api/tags/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Failed to search tags");
  const data = await response.json();
  return data;
};

// Dynamic import for TinyMCE Editor
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[500px] border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false, // This is important - it prevents server-side rendering
  }
);

export default function AddPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPinned: false,
      isHidden: false,
      categories: [],
      tags: [],
    },
  });

  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (coverImage) {
        const { data: uploadData, error } = await supabase.storage
          .from("post-images")
          .upload(`post-images/${coverImage.name}`, coverImage);

        if (error) {
          throw new Error("Error uploading image");
        }

        imageUrl = supabase.storage
          .from("post-images")
          .getPublicUrl(`post-images/${coverImage.name}`).data.publicUrl;
      }

      const slug = slugify(data.title, {
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      });

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          slug,
          coverImage: imageUrl,
          authorId: "your-user-id",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [tagSearchValue, setTagSearchValue] = useState("");

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
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
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
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
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "codesample",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "image media codesample  | removeformat | help",
                      images_upload_handler: async (blobInfo) => {
                        try {
                          const imageUrl = await handleImageUpload(
                            blobInfo.blob()
                          );
                          return imageUrl;
                        } catch (error) {
                          console.error("Editor image upload error:", error);
                          throw new Error("Failed to upload image");
                        }
                      },
                    }}
                    onEditorChange={onChange}
                    value={value}
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
                  const filteredCategories = categories.filter(
                    (category: Category) =>
                      category.name
                        .toLowerCase()
                        .includes(categorySearchValue.toLowerCase()) &&
                      !field.value.includes(category.id)
                  );

                  const selectedCategories = categories.filter(
                    (category: Category) => field.value.includes(category.id)
                  );

                  const handleKeyDown = async (
                    e: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (e.key === "Enter" && categorySearchValue.trim()) {
                      e.preventDefault();

                      const existingCategory = categories.find(
                        (category: Category) =>
                          category.name.toLowerCase() ===
                          categorySearchValue.toLowerCase()
                      );

                      if (existingCategory) {
                        if (!field.value.includes(existingCategory.id)) {
                          field.onChange([...field.value, existingCategory.id]);
                        }
                      } else {
                        try {
                          await createCategoryMutation.mutateAsync(
                            categorySearchValue
                          );
                          queryClient.invalidateQueries({
                            queryKey: ["categories"],
                          });
                          toast({
                            title: "Success",
                            description: "Category created successfully",
                          });
                        } catch (error) {
                          console.error("Category creation error:", error);
                          toast({
                            title: "Error",
                            description:
                              error instanceof Error
                                ? error.message
                                : "Failed to create category",
                            variant: "destructive",
                          });
                        }
                      }

                      setCategorySearchValue("");
                    }
                  };

                  return (
                    <div className="space-y-2">
                      <Input
                        value={categorySearchValue}
                        onChange={(e) => setCategorySearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or create new category (press Enter)"
                      />

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
                                  field.value.filter((id) => id !== category.id)
                                );
                              }}
                            />
                          </Badge>
                        ))}
                      </div>

                      {categorySearchValue && filteredCategories.length > 0 && (
                        <div className="border rounded-md p-2">
                          <div className="flex flex-wrap gap-2">
                            {filteredCategories.map((category: Category) => (
                              <Badge
                                key={category.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  field.onChange([...field.value, category.id]);
                                  setCategorySearchValue("");
                                }}
                              >
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {errors.categories && (
                <p className="text-sm text-red-500">
                  {errors.categories.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => {
                  const filteredTags = tags.filter(
                    (tag: Tag) =>
                      tag.name
                        .toLowerCase()
                        .includes(tagSearchValue.toLowerCase()) &&
                      !field.value.includes(tag.id)
                  );

                  const selectedTags = tags.filter((tag: Tag) =>
                    field.value.includes(tag.id)
                  );

                  const handleKeyDown = async (
                    e: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (e.key === "Enter" && tagSearchValue.trim()) {
                      e.preventDefault();

                      const existingTag = tags.find(
                        (tag: Tag) =>
                          tag.name.toLowerCase() ===
                          tagSearchValue.toLowerCase()
                      );

                      if (existingTag) {
                        if (!field.value.includes(existingTag.id)) {
                          field.onChange([...field.value, existingTag.id]);
                        }
                      } else {
                        try {
                          await createTagMutation.mutateAsync(tagSearchValue);
                          queryClient.invalidateQueries({ queryKey: ["tags"] });
                          toast({
                            title: "Success",
                            description: "Tag created successfully",
                          });
                        } catch (error) {
                          console.error("Tag creation error:", error);
                          toast({
                            title: "Error",
                            description:
                              error instanceof Error
                                ? error.message
                                : "Failed to create tag",
                            variant: "destructive",
                          });
                        }
                      }

                      setTagSearchValue("");
                    }
                  };

                  return (
                    <div className="space-y-2">
                      <Input
                        value={tagSearchValue}
                        onChange={(e) => setTagSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or create new tag (press Enter)"
                      />

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
                                  field.value.filter((id) => id !== tag.id)
                                );
                              }}
                            />
                          </Badge>
                        ))}
                      </div>

                      {tagSearchValue && filteredTags.length > 0 && (
                        <div className="border rounded-md p-2">
                          <div className="flex flex-wrap gap-2">
                            {filteredTags.map((tag: Tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  field.onChange([...field.value, tag.id]);
                                  setTagSearchValue("");
                                }}
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags.message}</p>
              )}
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
