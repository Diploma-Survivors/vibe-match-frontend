import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth' // Add this import
import type { JWT } from 'next-auth/jwt'
import {jwtDecode} from "jwt-decode";

type DecodedToken = {
  exp: number; // expiry timestamp (seconds since epoch)
  iat?: number;
  [key: string]: any;
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/v1'}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken, // Use the refresh token from the old token
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    // Update the token with the new accessToken and its expiry time
    return {
      accessToken: data.accessToken, // Fall back to old access token
      refreshToken: data.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError', // This will be used on the client to trigger a sign-out
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "sso",
      name: "SSO",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        redirect: { label: "Redirect", type: "text" },
        callbackUrl: { label: "Callback URL", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null;
        
        return {
          id: "sso-user",
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          redirect: credentials.redirect,
          callbackUrl: credentials.callbackUrl,
        };
      }
    })
    
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.userId = user.id
        token.refreshToken = user.refreshToken
        token.redirect = user.redirect;
        token.callbackUrl = user.callbackUrl;

        try {
          const decoded: DecodedToken = jwtDecode(user.accessToken as string);
          token.accessTokenExpires = decoded.exp * 1000; // convert seconds → ms
        } catch (err) {
          console.error("Failed to decode access token:", err);
          // fallback: expire in 1 hour
          token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        }
      }
      if (Date.now() > (token.accessTokenExpires as number)) {
        try {
          const data = await refreshAccessToken(token);
          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          const decoded: DecodedToken = jwtDecode(user.accessToken as string);
          token.accessTokenExpires = decoded.exp * 1000; // convert seconds → ms
        } catch (err) {
          console.error("Failed to decode access token:", err);
          // fallback: expire in 1 hour
          token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.redirect = token.redirect as string;
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl; // fallback
    },
  },
  pages: {
    signIn: '/auth/signin/abc',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  
}

export const auth = () => getServerSession(authOptions)