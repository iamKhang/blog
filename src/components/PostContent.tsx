'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";


interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }
  }, []);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
} 