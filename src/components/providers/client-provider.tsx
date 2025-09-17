"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers";
import { AppProvider } from "@/contexts/AppContext";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}