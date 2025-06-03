"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export default function EditSeriesPage({ params }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { id: seriesId } = use(params);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch series data
  const { data: series, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: async () => {
      const response = await fetch(`/api/series/by-id/${seriesId}`);
      if (!response.ok) throw new Error("Failed to fetch series");
      return response.json();
    },
  });

  // Set form values when series data is loaded
  useEffect(() => {
    if (series) {
      setValue("title", series.title);
      setValue("description", series.description);
      setValue("isActive", series.isActive);
      if (series.coverImage) {
        setCoverImagePreview(series.coverImage);
      }
    }
  }, [series, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const { data, error } = await uploadFile(
        "series-images",
        `series-images/${Date.now()}-${file.name}`,
        file
      );

      if (error || !data?.publicUrl) {
        throw new Error("Error uploading image");
      }

      return data.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const updateSeriesMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsSubmitting(true);
      try {
        const imageUrl = coverImage
          ? await handleImageUpload(coverImage)
          : series?.coverImage || '';

        const slug = slugify(data.title);

        const response = await fetch(`/api/series/by-id/${seriesId}`, {
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
          throw new Error(error.message || "Failed to update series");
        }

        return response.json();
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Series updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["series"] });
      router.push("/admin/series");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update series",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateSeriesMutation.mutate(data);
  };

  if (isLoadingSeries) {
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
          <CardTitle className="text-2xl font-bold">Edit Series</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter series title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter series description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
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
                  Select Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {coverImagePreview && (
                  <div className="relative">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      width={100}
                      height={100}
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
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch id="isActive" {...register("isActive")} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/series")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Series
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
