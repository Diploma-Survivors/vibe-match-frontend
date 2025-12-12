'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { IssuerType } from '@/types/states';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Code,
  FileText,
  Lightbulb,
  LogIn,
  LogOut,
  TestTube,
  Trophy,
  User,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface ProblemNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hideNavigation?: boolean;
}

const navItems = [
  { id: 'description', label: 'Problem', icon: FileText },
  { id: 'submissions', label: 'Submissions', icon: CheckCircle },
  { id: 'solutions', label: 'Solutions', icon: Lightbulb },
  { id: 'standing', label: 'Standing', icon: Trophy },
];

export default function ProblemNavbar({
  activeTab,
  onTabChange,
  hideNavigation = false,
}: ProblemNavbarProps) {
  const { issuer, user, clearUserData } = useApp();

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
          {issuer === IssuerType.LOCAL && (
            <Link href="/problems">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
              >
                <ArrowLeft className="w-4 h-4" />
                Trở về danh sách
              </Button>
            </Link>
          )}

          {/* If hideNavigation is true, render an empty div to maintain layout */}
          {/* {hideNavigation && <div className="w-20" />} */}

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
                  className={`gap-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Placeholder for future actions */}
          {/* <div className="w-20" /> */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex z-1000 items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none shadow-none">
                  <User size={18} />
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                  <ChevronDown size={16} className="ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer shadow-lg border border-slate-200 rounded-md min-w-32 min-h-10 bg-white mt-2 flex items-center gap-2 pl-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                <LogIn size={18} />
                Go to login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
