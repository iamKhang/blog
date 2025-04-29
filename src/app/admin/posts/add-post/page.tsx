"use client";

import { useState, useRef } from "react";
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
import { TinyEditor } from "@/components/TinyEditor";

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
  seriesId: z.string().optional(),
  orderInSeries: z.number().int().optional(),
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

const fetchSeries = async () => {
  const response = await fetch("/api/series?includeInactive=false");
  if (!response.ok) throw new Error("Failed to fetch series");
  return response.json();
};

const createCategory = async (name: string) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  // Đọc dữ liệu JSON từ response trước
  const data = await response.json();

  // Nếu response không ok, ném lỗi với thông báo từ server
  if (!response.ok) {
    // Kiểm tra nếu là lỗi category đã tồn tại
    if (response.status === 400 && data.message === "Category already exists") {
      throw new Error("Category already exists");
    }
    // Các lỗi khác
    throw new Error(data.message || "Failed to create category");
  }

  return data;
};

const createTag = async (name: string) => {
  const response = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  // Đọc dữ liệu JSON từ response trước
  const data = await response.json();

  // Nếu response không ok, ném lỗi với thông báo từ server
  if (!response.ok) {
    // Kiểm tra nếu là lỗi tag đã tồn tại
    if (response.status === 400 && data.message === "Tag already exists") {
      throw new Error("Tag already exists");
    }
    // Các lỗi khác
    throw new Error(data.message || "Failed to create tag");
  }

  return data;
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

  const { data: seriesData = { series: [] } } = useQuery({
    queryKey: ["series"],
    queryFn: fetchSeries,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      // Cập nhật cache của React Query với category mới
      queryClient.setQueryData(["categories"], (oldData: Category[] = []) => {
        return [...oldData, newCategory];
      });
      // Đồng thời invalidate query để đảm bảo dữ liệu được cập nhật từ server
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: (newTag) => {
      // Cập nhật cache của React Query với tag mới
      queryClient.setQueryData(["tags"], (oldData: Tag[] = []) => {
        return [...oldData, newTag];
      });
      // Đồng thời invalidate query để đảm bảo dữ liệu được cập nhật từ server
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

      // Use the slugify function with just the title
      const slug = slugify(data.title);

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

                  // Sử dụng biến để ngăn chặn việc gửi nhiều request
                  const [isSubmitting, setIsSubmitting] = useState(false);

                  const handleKeyDown = async (
                    e: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (e.key === "Enter" && categorySearchValue.trim() && !isSubmitting) {
                      e.preventDefault();

                      // Đánh dấu đang xử lý để ngăn chặn việc gửi nhiều request
                      setIsSubmitting(true);

                      try {
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
                            // Tạo category mới và lấy kết quả trả về
                            const newCategory = await createCategoryMutation.mutateAsync(
                              categorySearchValue
                            );

                            // Thêm category mới vào danh sách đã chọn
                            if (newCategory && newCategory.id) {
                              field.onChange([...field.value, newCategory.id]);
                            }

                            toast({
                              title: "Success",
                              description: "Category created successfully",
                            });
                          } catch (error) {
                            console.error("Category creation error:", error);

                            // Xử lý trường hợp category đã tồn tại
                            if (error instanceof Error && error.message === "Category already exists") {
                              // Tìm category trong danh sách hiện có
                              const existingCat = categories.find(
                                (cat: Category) => cat.name.toLowerCase() === categorySearchValue.toLowerCase()
                              );

                              // Nếu tìm thấy và chưa được chọn, thêm vào danh sách đã chọn
                              if (existingCat && !field.value.includes(existingCat.id)) {
                                field.onChange([...field.value, existingCat.id]);
                                toast({
                                  title: "Info",
                                  description: "Category already exists and has been selected",
                                });
                              } else {
                                toast({
                                  title: "Info",
                                  description: "Category already exists",
                                });
                              }
                            } else {
                              // Các lỗi khác
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
                        }

                        setCategorySearchValue("");
                      } finally {
                        // Đánh dấu đã xử lý xong
                        setIsSubmitting(false);
                      }
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

                  // Sử dụng biến để ngăn chặn việc gửi nhiều request
                  const [isTagSubmitting, setIsTagSubmitting] = useState(false);

                  const handleKeyDown = async (
                    e: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (e.key === "Enter" && tagSearchValue.trim() && !isTagSubmitting) {
                      e.preventDefault();

                      // Đánh dấu đang xử lý để ngăn chặn việc gửi nhiều request
                      setIsTagSubmitting(true);

                      try {
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
                            // Tạo tag mới và lấy kết quả trả về
                            const newTag = await createTagMutation.mutateAsync(tagSearchValue);

                            // Thêm tag mới vào danh sách đã chọn
                            if (newTag && newTag.id) {
                              field.onChange([...field.value, newTag.id]);
                            }

                            toast({
                              title: "Success",
                              description: "Tag created successfully",
                            });
                          } catch (error) {
                            console.error("Tag creation error:", error);

                            // Xử lý trường hợp tag đã tồn tại
                            if (error instanceof Error && error.message === "Tag already exists") {
                              // Tìm tag trong danh sách hiện có
                              const existingTag = tags.find(
                                (t: Tag) => t.name.toLowerCase() === tagSearchValue.toLowerCase()
                              );

                              // Nếu tìm thấy và chưa được chọn, thêm vào danh sách đã chọn
                              if (existingTag && !field.value.includes(existingTag.id)) {
                                field.onChange([...field.value, existingTag.id]);
                                toast({
                                  title: "Info",
                                  description: "Tag already exists and has been selected",
                                });
                              } else {
                                toast({
                                  title: "Info",
                                  description: "Tag already exists",
                                });
                              }
                            } else {
                              // Các lỗi khác
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
                        }

                        setTagSearchValue("");
                      } finally {
                        // Đánh dấu đã xử lý xong
                        setIsTagSubmitting(false);
                      }
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
                      field.onChange(value === "" ? undefined : value);
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
                      field.onChange(value === "" ? undefined : parseInt(value, 10));
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
