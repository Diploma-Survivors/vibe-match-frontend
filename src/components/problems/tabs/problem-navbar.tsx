'use client';

import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { ArrowLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface ProblemNavbarProps {
  hideNavigation?: boolean;
}

export default function ProblemNavbar({
  hideNavigation = false,
}: ProblemNavbarProps) {
  const { t } = useTranslation('problems');
  const { user, clearUserData } = useApp();

  const handleLogout = async () => {
    clearUserData();
    await signOut({
      callbackUrl: '/login', // Where to go after logout
      redirect: true,
    });
  };

  return (
    <nav className="h-14 bg-background border-b border-border flex items-center shrink-0 z-40">
      <div className="w-full px-4 flex items-center justify-between h-full">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/problems">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back_to_list')}
            </Button>
          </Link>
        </div>

        {/* User Menu */}
        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    </nav>
  );
}
