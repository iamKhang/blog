'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { IAllProps } from '@tinymce/tinymce-react';

// Dynamic import for TinyMCE Editor with proper type casting
const Editor = dynamic<IAllProps>(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor) as any,
  {
    loading: () => (
      <div className="flex items-center justify-center h-[500px] border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false, // This is important - it prevents server-side rendering
  }
);

export interface TinyEditorProps {
  value: string;
  onEditorChange: (content: string) => void;
  height?: number;
  minimalSetup?: boolean;
  imagesUploadHandler?: (blobInfo: any) => Promise<string>;
}

export function TinyEditor({
  value,
  onEditorChange,
  height = 500,
  minimalSetup = false,
  imagesUploadHandler,
}: TinyEditorProps) {
  const editorRef = useRef<any>(null);

  // Default plugins and toolbar for full setup
  const fullPlugins = [
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
  ];

  const fullToolbar =
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "image media codesample | removeformat | help";

  // Minimal plugins and toolbar for simpler setup
  const minimalPlugins = [
    'advlist', 'autolink', 'lists', 'link', 'charmap',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'wordcount'
  ];

  const minimalToolbar =
    'undo redo | blocks | ' +
    'bold italic | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist | ' +
    'removeformat';

  // Choose configuration based on minimalSetup prop
  const plugins = minimalSetup ? minimalPlugins : fullPlugins;
  const toolbar = minimalSetup ? minimalToolbar : fullToolbar;
  const menubar = !minimalSetup;

  // Base configuration
  const editorConfig: any = {
    height,
    menubar,
    plugins,
    toolbar,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  };

  // Add image upload handler if provided
  if (imagesUploadHandler && !minimalSetup) {
    editorConfig.images_upload_handler = async (blobInfo: any) => {
      try {
        return await imagesUploadHandler(blobInfo);
      } catch (error) {
        console.error("Editor image upload error:", error);
        throw new Error("Failed to upload image");
      }
    };
  }

  return (
    <Editor
      onInit={(_, editor) => editorRef.current = editor}
      init={editorConfig}
      onEditorChange={onEditorChange}
      value={value}
    />
  );
}
