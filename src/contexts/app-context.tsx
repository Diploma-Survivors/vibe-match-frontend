"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { UserInfo } from "@/types/states";

interface AppProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: "local" | "moodle";
}

interface AppContextType {
  user: UserInfo | null;
  issuer: "local" | "moodle";
  isInDedicatedPages: boolean;
  shouldHideNavigation: boolean;
  isLoading: boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const DEDICATED_PAGES_REGEX =
/^\/problems\/[^\/]+(?:\/(problem|submit|submissions|solutions|standing|test))?$/;

export function AppProvider({ children, initialUser, initialIssuer }: AppProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [issuer, setIssuer] = useState<"local" | "moodle">(initialIssuer);
  const [isLoading, setIsLoading] = useState(false);



  const pathname = usePathname();

  const isInDedicatedPages = DEDICATED_PAGES_REGEX.test(pathname);
  const shouldHideNavigation = issuer === "moodle" && isInDedicatedPages;

  const clearUserData = () => {
    setUser(null);
    setIssuer("local");
  };


  const value: AppContextType = {
    user,
    issuer,
    isInDedicatedPages,
    shouldHideNavigation,
    isLoading,
    clearUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
