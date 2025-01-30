// src/app/layout.tsx
import { Header } from "@/components/header";
import "./globals.css";
import { ReactNode } from "react";
import { Footer } from "@/components/footer";
import QueryProvider from "@/providers/query-provider";
import { AuthSyncProvider } from '@/providers/auth-sync-provider';
import { metadata } from './metadata';

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthSyncProvider>
            <Header />
            <main className="min-h-screen bg-gray-100">
              <div className="container mx-auto px-4">
                {children}
              </div>
            </main>
            <Footer />
          </AuthSyncProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
