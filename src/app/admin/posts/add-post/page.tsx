"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
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
import { toast } from "@/hooks/use-toast";

interface FormData {
  title: string;
  coverImage: FileList;
  excerpt: string;
  content: string;
}

export default function AddPostPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend API
      console.log("Form data:", data);

      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Post created",
        description: "Your new post has been successfully created.",
      });
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description:
          "There was a problem creating your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Create New Post
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                {...register("coverImage", {
                  required: "Cover image is required",
                })}
                className="mt-1"
              />
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coverImage.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt", { required: "Excerpt is required" })}
                className="mt-1"
                rows={3}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            <div>
              <Label>Content</Label>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field: { onChange, value } }) => (
                    <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    init={{
                      height: 500,
                      menubar: true, // Để menubar bật nếu bạn muốn thêm các tùy chọn hình ảnh
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'image media | removeformat | help', // Thêm 'image media' vào toolbar
                      images_upload_url: '/api/upload', // Đường dẫn API cho việc tải ảnh
                      automatic_uploads: true,
                      images_upload_handler: async (blobInfo, success, failure, progress) => {
                        // Xử lý tải ảnh lên tại đây, ví dụ với API nội bộ
                        try {
                          const formData = new FormData();
                          formData.append('file', blobInfo.blob(), blobInfo.filename());
                          
                          const response = await fetch('/api/upload', { // Đường dẫn API tải ảnh lên
                            method: 'POST',
                            body: formData,
                          });
                  
                          if (!response.ok) throw new Error('Upload failed');
                          
                          const data = await response.json();
                          success(data.location); // Trả về URL của ảnh đã tải lên
                        } catch (error) {
                          failure('Image upload failed');
                        }
                      },
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    onEditorChange={onChange}
                    value={value}
                  />
                  
                )}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="bg-[#EC8305] hover:bg-[#D97704]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
