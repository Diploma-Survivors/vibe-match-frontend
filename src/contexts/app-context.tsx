'use client';

import { persistor } from '@/store';
import { IssuerType, type UserInfo } from '@/types/states';
import type { UserProfile } from '@/types/user';
import { usePathname } from 'next/navigation';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { UserService } from '@/services/user-service';

interface AppProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: IssuerType;
}

interface AppContextType {
  user: UserProfile | null;
  issuer: IssuerType;
  isInDedicatedPages: boolean;
  shouldHideNavigation: boolean;
  isLoading: boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const dedicatedPagesPattern =
  process.env.NEXT_PUBLIC_DEDICATED_PAGES_PATTERN ||
  '^/(problems|contests)/.+$';
const DEDICATED_PAGES_REGEX = new RegExp(`${dedicatedPagesPattern}`);

export function AppProvider({
  children,
  initialUser,
  initialIssuer,
}: AppProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [issuer, setIssuer] = useState<IssuerType>(initialIssuer);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (initialUser?.id) {
        try {
          // Initialize with basic info while fetching
          // setUser({
          //   id: initialUser.userId,
          //   email: initialUser.email || '',
          //   firstName: initialUser.firstName || '',
          //   lastName: initialUser.lastName || '',
          //   username: '', // Placeholder
          //   // ... other required fields with defaults
          // } as UserProfile);

          // Actually, let's just fetch it.
          const profile = await UserService.getUserProfile(initialUser.id);
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Fallback to initialUser data if fetch fails?
          // For now, let's just log error.
          // We might want to construct a partial profile from initialUser if fetch fails.
        }
      } else {
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [initialUser]);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const isInDedicatedPages = DEDICATED_PAGES_REGEX.test(pathname);
  const shouldHideNavigation = isInDedicatedPages;

  const clearUserData = async () => {
    setUser(null);
    setIssuer(IssuerType.LOCAL);
    dispatch({ type: 'USER_LOGOUT' });
    await persistor.purge();
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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
