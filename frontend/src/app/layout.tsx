import type { Metadata } from "next";
import "./globals.css";
import { SidebarNav } from "@/components/layout/SidebarNav";

export const metadata: Metadata = {
  title: "HelpDesk AI — Intelligent Ticketing System",
  description: "AI-powered helpdesk chatbot with RAG — built on LLaMA 3.3 & ChromaDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="app-shell">
          <SidebarNav />
          <main className="app-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
