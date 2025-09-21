"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers";
import { AppProvider } from "@/contexts/app-context";
import type { UserInfo } from "@/types/states";

interface ClientProviderProps {
  children: React.ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: "local" | "moodle";
}

export function ClientProvider({
  children,
  initialUser,
  initialIssuer,
}: ClientProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AppProvider initialUser={initialUser} initialIssuer={initialIssuer}>
          {children}
        </AppProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
