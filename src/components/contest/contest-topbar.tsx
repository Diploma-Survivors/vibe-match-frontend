'use client';

import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import { selectContest } from '@/store/slides/contest-slice';
import {
  CONTEST_NAV_TABS_DETAIL,
  Contest,
  ContestNavTabs,
  ContestStatus,
} from '@/types/contests';
import { Menu } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import ContestTimer from './contest-timer';

interface ContestTopBarProps {
  activeTab?: ContestNavTabs;
  onTabChange: (tab: ContestNavTabs) => void;
  onMenuClick: () => void;
  onEndContest: () => void;
}

export default function ContestTopBar({
  activeTab = ContestNavTabs.DESCRIPTION,
  onTabChange,
  onMenuClick,
  onEndContest,
}: ContestTopBarProps) {
  const contest = useSelector(selectContest);
  const isInProgress = ContestsService.isInprogress(contest);

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
          {contest.name}
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
      <div className="flex items-center gap-4">
        {isInProgress && (
          <>
            <ContestTimer />
            <Button
              onClick={onEndContest}
              className="h-8 text-sm bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              Kết thúc
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
