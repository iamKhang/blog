// src/app/layout.tsx
import { Header } from "@/components/header";
import "./globals.css";
import { ReactNode } from "react";
import { Footer } from "@/components/footer";
import QueryProvider from "@/providers/query-provider";

export const metadata = {
  title: "My Blog",
  description: "A simple blog application using Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Header />
          <main className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4">
              {children}
            </div>
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
