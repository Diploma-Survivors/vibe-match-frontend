'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppProvider } from '@/contexts/app-context';
import { store } from '@/store';
import { ReduxProvider } from '@/store/providers';
import type { IssuerType, UserInfo } from '@/types/states';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';

interface ClientProviderProps {
  children: React.ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: IssuerType;
}

export function ClientProvider({
  children,
  initialUser,
  initialIssuer,
}: ClientProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <ReduxProvider>
          <AppProvider initialUser={initialUser} initialIssuer={initialIssuer}>
            {children}
          </AppProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
