'use client';

import { useEffect, useRef } from 'react';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const highlightCode = async () => {
      if (!contentRef.current || typeof window === 'undefined') return;
      try {
        const { default: Prism } = await import('prismjs');
        // Import CSS theme nếu chưa có
        if (!document.querySelector('link[href*="prism"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
          document.head.appendChild(link);
        }
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
        Prism.highlightAllUnder(contentRef.current);
      } catch (error) {
        console.error('❌ Error highlighting code:', error);
      }
    };

    timer = setTimeout(highlightCode, 400);

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-full prose-p:leading-relaxed prose-p:mb-4" ref={contentRef}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}