'use client';

import { Button } from '@/components/ui/button';
import { CONTEST_NAV_TABS_DETAIL, ContestNavTabs } from '@/types/contests';
import { Menu } from 'lucide-react';
import React from 'react';
import ContestTimer from './contest-timer';

interface ContestTopBarProps {
  contestName: string;
  problemTitle: string;
  endTime: string;
  activeTab?: ContestNavTabs;
  onTabChange: (tab: ContestNavTabs) => void;
  onMenuClick: () => void;
}

export default function ContestTopBar({
  contestName,
  problemTitle,
  endTime,
  activeTab = ContestNavTabs.DESCRIPTION,
  onTabChange,
  onMenuClick,
}: ContestTopBarProps) {
  return (
    <div className="h-14 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-4 gap-4">
      {/* Left: Contest Name (Clickable) */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Menu className="w-5 h-5" />
          {contestName}
        </Button>
        <button
          onClick={onMenuClick}
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          type="button"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        {CONTEST_NAV_TABS_DETAIL.map((item) => {
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

      {/* Right: Timer */}
      <div className="flex items-center gap-2">
        <ContestTimer endTime={endTime} />
      </div>
    </div>
  );
}
