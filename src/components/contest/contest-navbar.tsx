'use client';
import { Button } from '@/components/ui/button';
import type { Contest } from '@/types/contests';
import {
  ArrowLeft,
  BarChart2,
  Info,
  ListOrdered,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

interface ContestNavbarProps {
  contest: Contest;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'info', label: 'Thông tin', icon: Info },
  { id: 'stats', label: 'Thống kê', icon: BarChart2 },
  { id: 'ranking', label: 'Bảng xếp hạng', icon: ListOrdered },
  { id: 'join', label: 'Tham gia', icon: UserPlus },
];

export default function ContestNavbar({
  contest,
  activeTab,
  onTabChange,
}: ContestNavbarProps) {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link href="/contests">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`gap-2 transition-all ${isActive ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">
              {contest.name}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ID: {contest.id}
            </span>
          </div>
          <div className="md:hidden w-20" />
        </div>
      </div>
    </nav>
  );
}
