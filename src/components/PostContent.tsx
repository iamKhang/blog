'use client';

import { useEffect, useRef, useState } from 'react';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const highlightCode = async () => {
      if (!contentRef.current || typeof window === 'undefined') return;

      try {
        console.log('🎨 Starting code highlighting...');

        // CSS đã được import trong globals.css, không cần load động
        setCssLoaded(true);

        // Load Prism.js và các language components
        const { default: Prism } = await import('prismjs');
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

        // Highlight code
        Prism.highlightAllUnder(contentRef.current);
        console.log('✅ Code highlighting completed');

      } catch (error) {
        console.error('❌ Error highlighting code:', error);
      }
    };

    // Giảm delay vì CSS đã có sẵn
    timer = setTimeout(highlightCode, 300);

    return () => clearTimeout(timer);
  }, [content]);

  // Thêm fallback CSS khi CDN CSS chưa load
  useEffect(() => {
    if (!cssLoaded && typeof window !== 'undefined') {
      const fallbackStyle = document.createElement('style');
      fallbackStyle.id = 'prism-fallback';
      fallbackStyle.textContent = `
        pre[class*="language-"] {
          background: #2d3748 !important;
          color: #e2e8f0 !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1rem 0 !important;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace !important;
        }
        code[class*="language-"] {
          color: #e2e8f0 !important;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace !important;
        }
        .token.comment { color: #718096 !important; }
        .token.keyword { color: #9f7aea !important; }
        .token.string { color: #68d391 !important; }
        .token.number { color: #f6ad55 !important; }
        .token.function { color: #63b3ed !important; }
        .token.operator { color: #ed8936 !important; }
        .token.punctuation { color: #a0aec0 !important; }
      `;

      if (!document.getElementById('prism-fallback')) {
        document.head.appendChild(fallbackStyle);
      }

      return () => {
        const existingStyle = document.getElementById('prism-fallback');
        if (existingStyle && cssLoaded) {
          existingStyle.remove();
        }
      };
    }
  }, [cssLoaded]);

  return (
    <div className="prose dark:prose-invert max-w-full prose-p:leading-relaxed prose-p:mb-4" ref={contentRef}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}