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

        // Import CSS theme nếu chưa có
        if (!document.querySelector('link[href*="prism"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
          document.head.appendChild(link);
        }

        // Import các ngôn ngữ cần thiết
        await Promise.all([
          import('prismjs/components/prism-java' as any),
          import('prismjs/components/prism-javascript' as any),
          import('prismjs/components/prism-typescript' as any),
          import('prismjs/components/prism-python' as any),
          import('prismjs/components/prism-jsx' as any),
          import('prismjs/components/prism-css' as any),
          import('prismjs/components/prism-json' as any),
          import('prismjs/components/prism-bash' as any),
          import('prismjs/components/prism-sql' as any),
        ]);

        // Tìm tất cả code blocks
        const codeBlocks = contentRef.current.querySelectorAll('pre[class*="language-"]');

        if (codeBlocks.length > 0) {
          codeBlocks.forEach((block, index) => {
            const codeElement = block.querySelector('code');
            if (codeElement) {
              // Luôn copy class từ pre sang code
              codeElement.className = block.className;
              Prism.highlightElement(codeElement);
            } else {
              // Nếu không có code element, highlight trực tiếp pre
              Prism.highlightElement(block);
            }
          });
        } else {
          // Tìm tất cả pre elements
          const allPreElements = contentRef.current.querySelectorAll('pre');

          if (allPreElements.length > 0) {
            allPreElements.forEach((pre, index) => {
              const codeElement = pre.querySelector('code');
              if (codeElement) {
                // Nếu pre không có class language, thêm class mặc định
                if (!pre.className.includes('language-')) {
                  pre.className += ' language-none';
                }
                codeElement.className = pre.className;
                Prism.highlightElement(codeElement);
              } else {
                if (!pre.className.includes('language-')) {
                  pre.className += ' language-none';
                }
                Prism.highlightElement(pre);
              }
            });
          } else {
            // Fallback cuối cùng
            Prism.highlightAllUnder(contentRef.current);
          }
        }
      } catch (error) {
        console.error('❌ Error highlighting code:', error);
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