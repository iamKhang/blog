'use client';

import { useEffect, useRef } from 'react';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlightCode = async () => {
      if (!contentRef.current || typeof window === 'undefined') return;

      try {
        // Dynamic import Prism
        const { default: Prism } = await import('prismjs');

        // Import các ngôn ngữ cần thiết
        await Promise.all([
          import('prismjs/components/prism-java'),
          import('prismjs/components/prism-javascript'),
          import('prismjs/components/prism-typescript'),
          import('prismjs/components/prism-python'),
          import('prismjs/components/prism-jsx'),
          import('prismjs/components/prism-css'),
          import('prismjs/components/prism-json'),
          import('prismjs/components/prism-bash'),
          import('prismjs/components/prism-sql'),
        ]);

        // Tìm tất cả code blocks
        const codeBlocks = contentRef.current.querySelectorAll('pre[class*="language-"]');

        if (codeBlocks.length > 0) {
          codeBlocks.forEach((block) => {
            const codeElement = block.querySelector('code');
            if (codeElement) {
              // Copy class từ pre sang code nếu cần
              if (!codeElement.className && block.className) {
                codeElement.className = block.className;
              }
              Prism.highlightElement(codeElement);
            }
          });
        } else {
          // Fallback: highlight tất cả
          Prism.highlightAllUnder(contentRef.current);
        }
      } catch (error) {
        console.error('Error highlighting code:', error);
      }
    };

    // Delay để đảm bảo DOM ready
    const timer = setTimeout(highlightCode, 200);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-none" ref={contentRef}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}