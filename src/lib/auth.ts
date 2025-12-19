import type { DecodedAccessToken } from '@/types/states';
import { jwtDecode } from 'jwt-decode';
import { Database } from 'lucide-react';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth'; // Add this import
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/v1'}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.refreshToken}`,
        },
        body: JSON.stringify({
          deviceId: token.deviceId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    // Update the token with the new accessToken and its expiry time
    return {
      accessToken: data.accessToken, // Fall back to old access token
      refreshToken: data.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'sso',
      name: 'SSO',
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        redirect: { label: 'Redirect', type: 'text' },
        callbackUrl: { label: 'Callback URL', type: 'text' },
        deviceId: { label: 'Device ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null;
        return {
          id: 'sso-user',
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          redirect: credentials.redirect,
          callbackUrl: credentials.callbackUrl,
          deviceId: credentials.deviceId,
        };
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        // deviceId: { label: "Device ID", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing username or password');
        }

        try {
          // Call your backend login API
          // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     username: credentials.username,
          //     password: credentials.password,
          //   }),
          // });

          // mock data here
          const data = {
            user: {
              id: 'user-id',
            },
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNvdXJzZUlkIjoxLCJlbWFpbCI6InN0dWRlbnRAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoic3R1ZGVudCIsImxhc3ROYW1lIjoic3R1ZGVudCIsInJvbGVzIjpbIlNUVURFTlQiXSwic3ViIjoiMyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODg4OCIsImx0aVNlc3Npb25JZCI6ImU2YmQ2NWZmLWMzMGUtNDA2OS05ZWVmLWRmZGQzNDBmMTYyNyIsImlhdCI6MTc2NTQxOTY3MywiZXhwIjoxNzY1NDE5Njc0LCJhdWQiOiJsb2NhbGhvc3Q6MzAwMCJ9.h5pczel1OPQI-Uiw93IQxX_gnhec_6A2urIl5ykqfUc',
            refreshToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImNvdXJzZUlkIjoxLCJlbWFpbCI6InN0dWRlbnRAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoic3R1ZGVudCIsImxhc3ROYW1lIjoic3R1ZGVudCIsInJvbGVzIjpbIlNUVURFTlQiXSwic3ViIjoiMyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODg4OCIsImx0aVNlc3Npb25JZCI6ImU2YmQ2NWZmLWMzMGUtNDA2OS05ZWVmLWRmZGQzNDBmMTYyNyIsImlhdCI6MTc2NTQxOTY3MywiZXhwIjoxNzY1NTA2MDczLCJhdWQiOiJsb2NhbGhvc3Q6MzAwMCJ9.r2L3-b1e21g4ODmdXpOulLc5gZkEVKuCNa_bhuh8JKg',
            deviceId: 'device-id',
          };

          // if (!res.ok) {
          //   // Throw error to be caught by NextAuth frontend
          //   throw new Error(data.message || 'Authentication failed');
          // }

          // Return object MUST match the shape used in 'jwt' callback below
          return {
            id: data.user?.id || 'user-id',
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            deviceId: data.deviceId,
          };
        } catch (error: any) {
          console.error('Login logic error:', error);
          // Return null to display a generic error, or throw to display specific error
          throw new Error(error.message || 'Login failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
        token.refreshToken = user.refreshToken;
        token.redirect = user.redirect;
        token.callbackUrl = user.callbackUrl;
        token.deviceId = user.deviceId;
        return token;
      }

      if (trigger === 'update' && session?.action === 'refresh') {
        const data = await refreshAccessToken(token);
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.redirect = token.redirect as string;
      return session;
    },
    async redirect({ url }) {
      return url;
    },
  },
  pages: {
    signIn: '/login',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const auth = () => getServerSession(authOptions);
