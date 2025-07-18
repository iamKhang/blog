'use client';

import { useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  // Pre-process content to highlight code blocks
  const highlightedContent = useMemo(() => {
    if (!content?.trim()) return content;

    // Use a temporary div to parse and modify HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const codeBlocks = tempDiv.querySelectorAll('pre');
    
    codeBlocks.forEach((pre) => {
      const codeElement = pre.querySelector('code');
      if (!codeElement) return;

      const codeText = codeElement.textContent || '';
      if (!codeText.trim()) return;
      
      // Extract language from classes
      const preClasses = Array.from(pre.classList || []);
      const languageClass = preClasses.find(cls => cls.startsWith('language-'));
      
      let language = 'plaintext';
      if (languageClass) {
        language = languageClass.replace('language-', '');
        
        // Map common language aliases
        const languageMap: Record<string, string> = {
          'markup': 'xml',
          'html': 'xml', 
          'jsx': 'javascript',
          'tsx': 'typescript',
          'csharp': 'cs'
        };
        
        language = languageMap[language] || language;
      }

      try {
        // Generate highlighted HTML
        const result = hljs.highlight(codeText, { language });
        pre.innerHTML = `<code class="language-${language} hljs">${result.value}</code>`;
        pre.classList.add('hljs');
      } catch (error) {
        // Fallback - add classes but keep original content
        codeElement.classList.add('hljs');
        pre.classList.add('hljs');
      }
    });

    return tempDiv.innerHTML;
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-full prose-p:leading-relaxed prose-p:mb-4">
      <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
    </div>
  );
}