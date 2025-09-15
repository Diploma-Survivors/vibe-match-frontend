import type React from "react";
import "./globals.css";
import { Footer, Header } from "@/components/layout";
import { ThemeProvider } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolVibe - Decentralized Social Media on Solana",
  description:
    "Empowering creators with decentralized ownership, privacy, and fair rewards.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AppProvider>
              <Header />
              <main className="pt-16">{children}</main>
              <Footer />
            </AppProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { shouldHideNavigation, isLoading, isMoodleIssuer, isInDedicatedPages } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (shouldHideNavigation) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  // Local mode OR Moodle mode on non-dedicated pages - show full layout
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
