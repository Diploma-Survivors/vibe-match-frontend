'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import ContestTimer from './contest-timer';

interface ContestTopBarProps {
  contestName: string;
  problemTitle: string;
  endTime: string;
  onMenuClick: () => void;
}

export default function ContestTopBar({
  contestName,
  problemTitle,
  endTime,
  onMenuClick,
}: ContestTopBarProps) {
  return (
    <div className="h-14 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center px-4 gap-4">
      {/* Left: Contest Name (Clickable) */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <button
          onClick={onMenuClick}
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          type="button"
        >
          {contestName}
        </button>
      </div>

      {/* Center: Problem Title */}
      <div className="flex-1 text-center">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {problemTitle}
        </h2>
      </div>

      {/* Right: Timer */}
      <div className="flex items-center gap-2">
        <ContestTimer endTime={endTime} />
      </div>
    </div>
  );
}
