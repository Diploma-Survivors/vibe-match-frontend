'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { ArrowLeft, BarChart2, FileText, Trophy, UserPlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { UserMenu } from '../layout/user-menu';

interface ContestNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hideNavigation?: boolean;
}

const navItems = [
  { id: 'description', label: 'Mô tả', icon: FileText },
  // { id: 'stats', label: 'Thống kê', icon: BarChart2 },
  { id: 'ranking', label: 'Bảng xếp hạng', icon: Trophy },
  // { id: 'join', label: 'Tham gia', icon: UserPlus },
];

export default function ContestNavbar({
  activeTab,
  onTabChange,
  hideNavigation = false,
}: ContestNavbarProps) {
  const { user, clearUserData } = useApp();

  const handleLogout = async () => {
    clearUserData();
    await signOut({
      callbackUrl: '/login', // Where to go after logout
      redirect: true,
    });
  };
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Button - only show if hideNavigation is false */}
          <Link href="/contests">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Trở về danh sách</span>
            </Button>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`gap-2 transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Placeholder for future actions */}
          <div>
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
}
