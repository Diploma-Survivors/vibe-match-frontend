'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppProvider } from '@/contexts/app-context';
import { persistor, store } from '@/store';
import { ReduxProvider } from '@/store/providers';
import type { IssuerType, UserInfo } from '@/types/states';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { DialogProvider } from './dialog-provider';
import { ToastProvider } from './toast-provider';

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
        <DialogProvider>
          <ToastProvider>
            <ReduxProvider>
              <PersistGate loading={null} persistor={persistor}>
                <AppProvider
                  initialUser={initialUser}
                  initialIssuer={initialIssuer}
                >
                  {children}
                </AppProvider>
              </PersistGate>
            </ReduxProvider>
          </ToastProvider>
        </DialogProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
