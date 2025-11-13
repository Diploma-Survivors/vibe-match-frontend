import { authOptions } from '@/lib/auth';
import {
  type DecodedAccessToken,
  IssuerType,
  type UserInfo,
} from '@/types/states';
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

  let initialUser: UserInfo | null = null;
  let initialIssuer: IssuerType = IssuerType.LOCAL;

  if (session?.accessToken) {
    try {
      const decoded: DecodedAccessToken = jwtDecode(session.accessToken);

      initialUser = {
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        fullName: `${decoded.firstName} ${decoded.lastName}`.trim(),
        roles: decoded.roles || [],
      };

      initialIssuer = decoded.iss?.includes(
        process.env.NEXT_PUBLIC_LOCAL_ISSUER_IDENTIFIER || 'local_issuer'
      )
        ? IssuerType.LOCAL
        : IssuerType.MOODLE;
    } catch (err) {
      console.error('❌ Failed to decode access token:', err);
    }
  }

  return (
    <ClientProvider initialUser={initialUser} initialIssuer={initialIssuer}>
      {children}
    </ClientProvider>
  );
}
