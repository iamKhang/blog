// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "My Blog",
  description: "A simple blog application using Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white p-4 text-center">
            <h1>My Blog</h1>
          </header>
          <section className="container mx-auto p-4">{children}</section>
        </main>
      </body>
    </html>
  );
}
