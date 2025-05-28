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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TinyEditor } from "@/components/TinyEditor";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.any().optional(),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  tags: z.string().optional(),
  seriesId: z.string().optional(),
  orderInSeries: z.number().int().optional(),
});

type FormData = z.infer<typeof formSchema>;

const fetchSeries = async () => {
  const response = await fetch("/api/series?includeInactive=false");
  if (!response.ok) throw new Error("Failed to fetch series");
  return response.json();
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
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPinned: false,
      isHidden: false,
      tags: "",
    },
  });

  const queryClient = useQueryClient();
  const watchSeriesId = watch("seriesId");

  const { data: seriesData = { series: [] } } = useQuery({
    queryKey: ["series"],
    queryFn: fetchSeries,
  });

  const handleImageUpload = async (blob: Blob): Promise<string> => {
    const file = new File([blob], `image-${Date.now()}.png`, {
      type: blob.type,
    });
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `post-images/${fileName}`;

      const { data, error } = await uploadFile(
        "post-images",
        filePath,
        file
      );

      if (error || !data?.publicUrl) {
        throw new Error(error?.message || "Error uploading image");
      }

      return data.publicUrl;
    } catch (error: any) {
      console.error("Image upload error:", error?.message || error);
      throw new Error(error?.message || "Failed to upload image");
    }
  };

  const handleCoverImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (coverImage) {
        imageUrl = await handleImageUpload(coverImage);
      }

      const slug = slugify(data.title);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          slug,
          coverImage: imageUrl,
          authorId: "68104903dcef03c0f4792468", // Replace with actual user ID
          published: !data.isHidden,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
      }

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/admin/posts");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => {
                      setCoverImagePreview(null);
                      setCoverImage(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
                rows={3}
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

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="Enter tags separated by commas (e.g., react, nextjs, typescript)"
              />
              <p className="text-sm text-gray-500">
                Separate tags with commas
              </p>
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
                      field.onChange(value === "none" ? undefined : value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a series (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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
            {watchSeriesId && (
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
                    />
                  )}
                />
                <p className="text-sm text-gray-500">
                  Leave empty for automatic ordering
                </p>
              </div>
            )}

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
