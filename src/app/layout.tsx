// src/app/layout.tsx
import { Header } from "@/components/header";
import "./globals.css";
import { ReactNode } from "react";
import { HeroSection } from "@/components/hero/Hero";
export const metadata = {
  title: "My Blog",
  description: "A simple blog application using Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="min-h-screen bg-gray-100">
          <Header />

          <section className="container mx-auto">
          {children}
          </section>
        </main>
      </body>
    </html>
  );
}
