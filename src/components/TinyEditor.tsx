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

  // Cấu hình ngôn ngữ cho codesample plugin
  const codeLanguages = [
    { text: 'HTML/XML', value: 'html' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'TypeScript', value: 'typescript' },
    { text: 'JSX', value: 'jsx' },
    { text: 'TSX', value: 'tsx' },
    { text: 'CSS', value: 'css' },
    { text: 'SCSS', value: 'scss' },
    { text: 'JSON', value: 'json' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'C#', value: 'csharp' },
    { text: 'C++', value: 'cpp' },
    { text: 'C', value: 'c' },
    { text: 'PHP', value: 'php' },
    { text: 'Go', value: 'go' },
    { text: 'Rust', value: 'rust' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'Kotlin', value: 'kotlin' },
    { text: 'Swift', value: 'swift' },
    { text: 'Dart', value: 'dart' },
    { text: 'R', value: 'r' },
    { text: 'SQL', value: 'sql' },
    { text: 'Bash/Shell', value: 'bash' },
    { text: 'PowerShell', value: 'powershell' },
    { text: 'CMD/Batch', value: 'batch' },
    { text: 'YAML', value: 'yaml' },
    { text: 'Markdown', value: 'markdown' },
    { text: 'Docker', value: 'dockerfile' },
    { text: 'Nginx', value: 'nginx' },
    { text: 'Git', value: 'git' },
    { text: 'Plain Text', value: 'plaintext' }
  ];

  // Default plugins và toolbar cho full setup
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

  // Minimal plugins và toolbar cho simpler setup
  const minimalPlugins = [
    'advlist', 'autolink', 'lists', 'link', 'charmap',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'wordcount', 'codesample'
  ];

  const minimalToolbar =
    'undo redo | blocks | ' +
    'bold italic | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist | ' +
    'codesample | removeformat';

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
        content_style: `
          body { 
            font-family: Helvetica, Arial, sans-serif; 
            font-size: 14px;
            background: #ffffff;
          }
          /* Simple code block styling in editor - actual highlighting happens in display */
          pre {
            background: #f8f8fa !important;
            color: #24292e !important;
            padding: 1.5em !important;
            border-radius: 8px !important;
            overflow-x: auto !important;
            margin: 1.5rem 0 !important;
            font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            border: 1px solid #e1e4e8 !important;
            font-weight: 400 !important;
          }
          code {
            background: #f8f8fa !important;
            color: #24292e !important;
            font-family: 'Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            padding: 0.2em 0.4em !important;
            border-radius: 4px !important;
            border: 1px solid #e1e4e8 !important;
            font-size: 0.85em !important;
          }
          pre code {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            font-size: inherit !important;
          }
        `,
        // Cấu hình codesample plugin
        codesample_languages: codeLanguages,
        
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
