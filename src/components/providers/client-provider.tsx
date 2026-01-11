'use client';

import '@/lib/i18n';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppProvider } from '@/contexts/app-context';
import { persistor, store } from '@/store';
import { ReduxProvider } from '@/store/providers';
import type { DecodedAccessToken, IssuerType, UserInfo } from '@/types/states';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { DialogProvider } from './dialog-provider';
import { ToastProvider } from './toast-provider';

interface ClientProviderProps {
  children: React.ReactNode;
  decodedAccessToken: DecodedAccessToken | null;
}

export function ClientProvider({
  children,
  decodedAccessToken,
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
                <AppProvider decodedAccessToken={decodedAccessToken}>
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
