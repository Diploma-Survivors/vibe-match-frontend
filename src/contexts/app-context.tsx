'use client';

import { persistor } from '@/store';
import { IssuerType, type UserInfo } from '@/types/states';
import { usePathname } from 'next/navigation';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

interface AppProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: IssuerType;
}

interface AppContextType {
  user: UserInfo | null;
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
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [issuer, setIssuer] = useState<IssuerType>(initialIssuer);
  const [isLoading, setIsLoading] = useState(false);

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
