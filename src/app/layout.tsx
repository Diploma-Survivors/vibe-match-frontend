import type React from 'react';
import './globals.css';
import { ConditionalLayout } from '@/components/layout';
import { ClientProvider, ThemeProvider } from '@/components/providers';
import { ServerProvider } from '@/components/providers/server-provider';
import { AppProvider } from '@/contexts/app-context';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vibe Match - Decentralized Social Media',
  description:
    'Empowering creators with decentralized ownership, privacy, and fair rewards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <ServerProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ServerProvider>
      </body>
    </html>
  );
}
