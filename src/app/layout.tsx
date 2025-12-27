import type React from 'react';
import './globals.css';
import './styles/editor-theme.css';
import { ConditionalLayout } from '@/components/layout';
import { ServerProvider } from '@/components/providers/server-provider';
import { AppProvider } from '@/contexts/app-context';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SfinX - Ultimate Coding Platform',
  description:
    'Improve your coding skills with SfinX. Practice problems, compete in contests, and climb the leaderboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ServerProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ServerProvider>
      </body>
    </html>
  );
}
