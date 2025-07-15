// Root Layout - Required by Next.js
import "./globals.css";
import { ReactNode } from "react";
import QueryProvider from "@/providers/query-provider";
import { AuthSyncProvider } from '@/providers/auth-sync-provider';
import { Toaster } from "@/components/ui/toaster";
import { metadata } from './(user)/metadata';

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthSyncProvider>
            {children}
          </AuthSyncProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
