'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';
import "prismjs/components/prism-java";
// Import thêm các ngôn ngữ khác nếu cần
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-css";
import "prismjs/components/prism-html";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
} 