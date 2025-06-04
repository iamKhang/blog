"use client";

import { useEffect, useRef } from "react";

export default function DebugPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Log DOM structure
      console.log("Container element:", containerRef.current);
      console.log("Parent elements:", getParentElements(containerRef.current));
    }
  }, []);

  // Function to get all parent elements up to body
  const getParentElements = (element: HTMLElement) => {
    const parents = [];
    let currentElement = element.parentElement;
    
    while (currentElement) {
      parents.push({
        tagName: currentElement.tagName,
        id: currentElement.id,
        className: currentElement.className,
        computedStyle: {
          padding: window.getComputedStyle(currentElement).padding,
          margin: window.getComputedStyle(currentElement).margin,
          width: window.getComputedStyle(currentElement).width,
          display: window.getComputedStyle(currentElement).display,
          position: window.getComputedStyle(currentElement).position,
        }
      });
      currentElement = currentElement.parentElement;
    }
    
    return parents;
  };

  return (
    <div ref={containerRef} className="p-4 border border-red-500">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p>This page is used to debug the layout structure.</p>
      <p className="mt-4">Check the browser console for DOM structure information.</p>
      
      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Layout Structure</h2>
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-xs">
          {`
1. Root Layout
2. Admin Layout
   - Sidebar (w-64)
   - Main Content
          `}
        </pre>
      </div>
    </div>
  );
}
