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
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from '../ui/tooltip';
import ContestTimer from './contest-timer';

interface ContestTopBarProps {
  activeTab?: ContestNavTabs;
  disableNext?: boolean;
  disablePrevious?: boolean;
  onTabChange: (tab: ContestNavTabs) => void;
  onMenuClick: () => void;
  onEndContest: () => void;
  onNextProblem: () => void;
  onPreviousProblem: () => void;
}

export default function ContestTopBar({
  activeTab = ContestNavTabs.DESCRIPTION,
  disableNext = false,
  disablePrevious = false,
  onTabChange,
  onMenuClick,
  onEndContest,
  onNextProblem,
  onPreviousProblem,
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
        <div className="flex items-center">
          <Tooltip content="Bài trước" side="bottom">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousProblem}
              disabled={disablePrevious}
              className="hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-6 h-6 size-6" />
            </Button>
          </Tooltip>
          <Tooltip content="Bài tiếp theo" side="bottom">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextProblem}
              disabled={disableNext}
              className="hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-6 h-6 size-6" />
            </Button>
          </Tooltip>
        </div>
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
      <div className="flex items-center min-w-[250px] gap-4 justify-end">
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
