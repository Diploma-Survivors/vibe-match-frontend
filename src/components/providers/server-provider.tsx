import { authOptions } from '@/lib/auth';
import type { DecodedAccessToken, UserInfo } from '@/types/states';
import { IssuerType } from '@/types/states';
import { jwtDecode } from 'jwt-decode';
import { getServerSession } from 'next-auth';
// app/ServerProvider.tsx
import type { ReactNode } from 'react';
import { ClientProvider } from './client-provider';

interface ServerProviderProps {
  children: ReactNode;
}

export async function ServerProvider({ children }: ServerProviderProps) {
  const session = await getServerSession(authOptions);

  let decodedAccessToken: DecodedAccessToken | null = null;

  if (session?.accessToken) {
    try {
      decodedAccessToken = jwtDecode(session.accessToken);
    } catch (err) {
      console.error('❌ Failed to decode access token:', err);
    }
  }

  return (
    <ClientProvider decodedAccessToken={decodedAccessToken}>
      {children}
    </ClientProvider>
  );
}
