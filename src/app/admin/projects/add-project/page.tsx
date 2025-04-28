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
import { Loader2, ImagePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { TinyEditor } from "@/components/TinyEditor";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  status: z.enum(["COMPLETED", "IN_PROGRESS", "PLANNED"]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  docsUrl: z.string().url().optional().or(z.literal("")),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
  isPinned: z.boolean().default(false),
  isHidden: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;



const fetchTechnologies = async () => {
  const response = await fetch("/api/technologies");
  if (!response.ok) throw new Error("Failed to fetch technologies");
  return response.json();
};

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPinned: false,
      isHidden: false,
      technologies: [],
    },
  });

  const { data: technologies = [] } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadFile(file, "project-images");
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create project",
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
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Upload Thumbnail
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const imageUrl = await handleImageUpload(file);
                        setThumbnailPreview(imageUrl);
                        setValue("thumbnail", imageUrl);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to upload thumbnail",
                          variant: "destructive",
                        });
                      }
                    }
                  }}
                />
              </div>
              {thumbnailPreview && (
                <div className="relative w-full h-48 mt-4">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              {errors.thumbnail && (
                <p className="text-sm text-red-500">{errors.thumbnail.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt")}
                placeholder="Enter project excerpt"
              />
              {errors.excerpt && (
                <p className="text-sm text-red-500">{errors.excerpt.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TinyEditor
                    value={value}
                    onEditorChange={onChange}
                    imagesUploadHandler={async (blobInfo) => {
                      const file = new File([blobInfo.blob()], `image-${Date.now()}.png`, {
                        type: blobInfo.blob().type,
                      });
                      return await handleImageUpload(file);
                    }}
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* URLs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  {...register("githubUrl")}
                  placeholder="Enter GitHub repository URL"
                />
                {errors.githubUrl && (
                  <p className="text-sm text-red-500">{errors.githubUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  {...register("demoUrl")}
                  placeholder="Enter demo URL"
                />
                {errors.demoUrl && (
                  <p className="text-sm text-red-500">{errors.demoUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="docsUrl">Documentation URL</Label>
                <Input
                  id="docsUrl"
                  {...register("docsUrl")}
                  placeholder="Enter documentation URL"
                />
                {errors.docsUrl && (
                  <p className="text-sm text-red-500">{errors.docsUrl.message}</p>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies</Label>
              <Controller
                name="technologies"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech: any) => (
                        <Badge
                          key={tech.id}
                          variant={field.value.includes(tech.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newValue = field.value.includes(tech.id)
                              ? field.value.filter((id) => id !== tech.id)
                              : [...field.value, tech.id];
                            field.onChange(newValue);
                          }}
                        >
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              />
              {errors.technologies && (
                <p className="text-sm text-red-500">{errors.technologies.message}</p>
              )}
            </div>

            {/* Project Settings */}
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
                "Create Project"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
