// User Layout - Nested layout for user pages
import { Header } from "@/components/header";
import { ReactNode } from "react";
import { Footer } from "@/components/footer";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
