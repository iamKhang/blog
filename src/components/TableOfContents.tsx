'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface PostInfo {
  title: string;
  createdAt: string;
}

export default function TableOfContents({ 
  content, 
  postInfo 
}: { 
  content: string;
  postInfo: PostInfo;
}) {
  const [activeId, setActiveId] = useState<string>('');
  const [toc, setToc] = useState<TOCItem[]>([]);

  // Tách logic tạo TOC ra thành một useEffect riêng
  useEffect(() => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4');
    
    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      };
    });

    setToc(items);
  }, [content]);

  // Tách logic intersection observer ra thành một useEffect riêng
  useEffect(() => {
    if (!toc.length) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    });

    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    headings.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []); // Không phụ thuộc vào toc nữa

  if (toc.length === 0) return null;

  return (
    <nav className="table-of-contents">
      {/* Post Info */}
      <div className="mb-6 pb-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
          {postInfo.title}
        </h2>
        <time className="text-sm text-muted-foreground">
          {format(new Date(postInfo.createdAt), "dd/MM/yyyy")}
        </time>
      </div>

      {/* Table of Contents */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Mục lục</h3>
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={`toc-${item.id}`}>
                <a
                  href={`#${item.id}`}
                  className={`toc-level-${item.level} ${
                    activeId === item.id ? 'active' : ''
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related Posts */}
      <div className="pt-4 border-t dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>
        <ul className="space-y-3">
          <li>
            <a href="#" className="hover:text-primary transition-colors duration-200">
              Singleton Design Pattern - Trợ thủ đắc lực của Developers
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors duration-200">
              Abstract Factory Design Pattern - Trợ thủ đắc lực của Developers
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors duration-200">
              Builder Design Pattern - Trợ thủ đắc lực của Developers
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
} 