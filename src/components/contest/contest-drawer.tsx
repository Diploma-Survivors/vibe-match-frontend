'use client';

import { Badge } from '@/components/ui/badge';
import type { ContestRanking } from '@/types/contest-solve';
import {
  type ContestProblem,
  ContestProblemStatus,
  ContestProblemStatusTooltip,
} from '@/types/contests';
import { getDifficultyColor } from '@/types/problems';
import { CheckCircle, Minus, X } from 'lucide-react';
import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../ui/tooltip';

interface ContestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contestName: string;
  problems: ContestProblem[];
  ranking: ContestRanking[];
  currentProblemId: string;
  onProblemClick: (problemId: string) => void;
}

const ContestProblemStatusIcons: Record<ContestProblemStatus, JSX.Element> = {
  [ContestProblemStatus.SOLVED]: (
    <CheckCircle className="w-5 h-5 text-green-600" />
  ),
  [ContestProblemStatus.UN_ATTEMPTED]: <div />,
  [ContestProblemStatus.ATTEMPTED]: (
    <Minus className="w-5 h-5 text-amber-600" />
  ),
  [ContestProblemStatus.UNSOLVED]: <X className="w-5 h-5 text-red-600" />,
};

export default function ContestDrawer({
  isOpen,
  onClose,
  contestName,
  problems,
  ranking,
  currentProblemId,
  onProblemClick,
}: ContestDrawerProps) {
  const { t } = useTranslation('contests');
  const [activeTab, setActiveTab] = useState<'problems' | 'ranking'>(
    'problems'
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 w-96 bg-background border-r border-border
          z-[60] shadow-2xl flex flex-col
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-card/50">
          <h2 className="text-lg font-bold text-foreground">
            {contestName}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Control */}
        <div className="flex border-b border-border bg-muted/20">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'problems'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            type="button"
          >
            {t('problems')}
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'ranking'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            type="button"
          >
            {t('ranking')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-background/50">
          {activeTab === 'problems' ? (
            <div className="p-4 space-y-2">
              {problems.map((problem, idx) => (
                <button
                  key={problem.id}
                  onClick={() => {
                    onProblemClick(problem.id);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${currentProblemId === problem.id
                      ? 'border-primary/50 bg-primary/5 shadow-sm'
                      : 'border-border hover:bg-accent/50 hover:border-accent'
                    }`}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <Tooltip
                      content={ContestProblemStatusTooltip[problem.status]}
                    >
                      <div className="flex-shrink-0 mt-0.5 min-w-5">
                        {ContestProblemStatusIcons[problem.status]}
                      </div>
                    </Tooltip>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-muted-foreground">
                          Q{idx + 1}.
                        </span>
                        <span className="text-sm font-medium text-foreground truncate">
                          {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getDifficultyColor(
                            problem.difficulty
                          )} text-xs`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {`${problem.userScore ?? 0}/${problem.maxScore ?? 0} pts`}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-2">
                {ranking.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`p-3 rounded-lg border ${entry.isCurrentUser
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border bg-card'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-bold ${entry.rank === 1
                              ? 'text-yellow-500' // Gold
                              : entry.rank === 2
                                ? 'text-slate-400' // Silver
                                : entry.rank === 3
                                  ? 'text-amber-700' // Bronze
                                  : 'text-muted-foreground'
                            }`}
                        >
                          #{entry.rank}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {entry.username}
                        </span>
                        {entry.country && (
                          <span className="text-[10px] bg-muted px-1.5 rounded text-muted-foreground">{entry.country}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary block">
                          {entry.score}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Time: {entry.timeSpent}</span>
                      <span>Solved: {entry.problemsSolved}</span>
                    </div>
                    {/* Progress Bar Visual */}
                    <div className="flex gap-1 mt-2 h-1.5">
                      {Array.isArray(entry.progress) &&
                        entry.progress.map((solved, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full ${solved ? 'bg-green-500' : 'bg-muted'
                              }`}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
