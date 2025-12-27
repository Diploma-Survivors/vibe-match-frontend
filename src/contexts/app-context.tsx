'use client';

import clientApi from '@/lib/apis/axios-client';
import type { DecodedAccessToken, UserInfo } from '@/types/states';

import { UserProfile } from '@/types/user';
import { usePathname } from 'next/navigation';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AppProviderProps {
  children: ReactNode;
  decodedAccessToken: DecodedAccessToken | null;
}

interface AppContextType {
  user?: UserProfile;
  shouldHideNavigation: boolean;
  isLoading: boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const dedicatedPagesPattern =
  process.env.NEXT_PUBLIC_DEDICATED_PAGES_PATTERN ||
  '^(?:/problems/(?:create|[^/]+(?:/(create|edit))?)|/contests/(?:create|[^/]+(?:/(?:edit|stats|standing|submissions)))|/options)$';

export function AppProvider({
  children,
  decodedAccessToken,
}: AppProviderProps) {
  const [user, setUser] = useState<UserProfile>();
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const shouldHideNavigation = pathname === '/login';

  const clearUserData = () => {
    setUser(undefined);
  };

  useEffect(() => {
    // Mock user for UI testing
    if (!decodedAccessToken) {
      setUser({
        id: 'mock-user-id',
        username: 'ui-tester',
        email: 'tester@sfinx.com',
        firstName: 'UI',
        lastName: 'Tester',
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any);
      return;
    }

    if (decodedAccessToken) {
      setIsLoading(true);
      clientApi
        .get('/auth/me')
        .then((response) => {
          setUser(response.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
          // Fallback to mock user on error for UI testing
          setUser({
            id: 'mock-user-id',
            username: 'ui-tester',
            email: 'tester@sfinx.com',
            firstName: 'UI',
            lastName: 'Tester',
            role: 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any);
          setIsLoading(false);
        });
    }
  }, [decodedAccessToken]);

  const value: AppContextType = {
    user,
    shouldHideNavigation,
    isLoading,
    clearUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
