'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

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
    "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
    "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
    "insertdatetime", "media", "table", "help", "wordcount", "codesample"
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

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_, editor) => editorRef.current = editor}
      init={{
        height,
        menubar,
        plugins,
        toolbar,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        ...(imagesUploadHandler && !minimalSetup ? {
          images_upload_handler: async (blobInfo: any, _progress: any) => {
            try {
              return await imagesUploadHandler(blobInfo);
            } catch (error) {
              console.error("Editor image upload error:", error);
              throw new Error("Failed to upload image");
            }
          }
        } : {})
      }}
      onEditorChange={onEditorChange}
      value={value}
    />
  );
}
