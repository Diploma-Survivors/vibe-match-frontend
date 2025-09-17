"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { DecodedAccessToken, UserInfo } from '@/types/states'
import { usePathname } from "next/navigation";



interface AppContextType {
  // User information
  user: UserInfo | null;

  // Issuer information
  issuer: 'local' | 'moodle';
  isInDedicatedPages: boolean;

  // UI state based on issuer
  shouldHideNavigation: boolean;

  // Loading state
  isLoading: boolean;

  // Methods
  initializeFromToken: (accessToken: string) => void;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [issuer, setIssuer] = useState<'local' | 'moodle'>('local');
  const [isLoading, setIsLoading] = useState(true);
  const [shouldHideNavigation, setShouldHideNavigation] = useState(false);
  const pathname = usePathname();


  // Derived states
  // we can add contest page later on
  const isInDedicatedPages = /^\/problems\/[^\/]+\/(problem|submit|submissions|solutions|standing|test)$/.test(pathname);

  const initializeFromToken = (accessToken: string) => {
    console.log('🔑 Initializing from access token', accessToken);
    try {
      const decoded: DecodedAccessToken = jwtDecode(accessToken);

      // Extract user information
      const userInfo: UserInfo = {
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        fullName: `${decoded.firstName} ${decoded.lastName}`.trim(),
        roles: decoded.roles || [],
      };

      // Determine issuer
      console.log("Decoded token:", decoded);
      const issuerType: 'local' | 'moodle' = decoded.iss?.includes('local') ? 'local' : 'moodle';

      setUser(userInfo);
      setIssuer(issuerType);

    } catch (error) {
      console.error('❌ Failed to decode access token:', error);
      clearUserData();
    }
  };

  const clearUserData = () => {
    setUser(null);
    setIssuer('local');
    console.log('🧹 User data cleared');
  };

  // Initialize from session when available
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }
    console.log("Session status:", status, session);

    if (session?.accessToken) {
      initializeFromToken(session.accessToken);
    } else {
      clearUserData();
    }

    setIsLoading(false);
  }, [session, status]);

  useEffect(() => {
    setShouldHideNavigation(issuer === 'moodle' && isInDedicatedPages);
  }, [issuer, isInDedicatedPages]);

  console.log({
    user,
    issuer,
    isInDedicatedPages,
    shouldHideNavigation,
    isLoading
  })

  const value: AppContextType = {
    user,
    issuer,
    isInDedicatedPages,
    shouldHideNavigation,
    isLoading,
    initializeFromToken,
    clearUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks
export function useUser() {
  const { user } = useApp();
  return user;
}

export function useIssuer() {
  const { issuer, isInDedicatedPages, shouldHideNavigation } = useApp();
  return { issuer, isInDedicatedPages, shouldHideNavigation };
}