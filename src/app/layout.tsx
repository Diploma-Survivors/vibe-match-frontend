import type React from "react";
import "./globals.css";
import { ThemeProvider, ClientProvider } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/AppContext";
import { SessionProvider } from "next-auth/react";
import { ConditionalLayout } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vibe Match - Decentralized Social Media",
  description:
    "Empowering creators with decentralized ownership, privacy, and fair rewards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ClientProvider>
      </body>
    </html>
  );
}