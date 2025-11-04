'use client';

import { Badge } from '@/components/ui/badge';
import type { ContestRanking } from '@/types/contest-solve';
import { CheckCircle, Circle, Minus, X } from 'lucide-react';
import { useState } from 'react';

interface ContestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contestName: string;
  problems: Array<{
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    score: number;
    status: 'unsolved' | 'attempted' | 'solved';
  }>;
  ranking: ContestRanking[];
  currentProblemId: string;
  onProblemClick: (problemId: string) => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusIcons = {
  solved: <CheckCircle className="w-5 h-5 text-green-600" />,
  attempted: <Minus className="w-5 h-5 text-orange-600" />,
  unsolved: <Circle className="w-5 h-5 text-slate-400" />,
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
  const [activeTab, setActiveTab] = useState<'problems' | 'ranking'>(
    'problems'
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-96 bg-white dark:bg-slate-800 z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {contestName}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'problems'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            type="button"
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ranking'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            type="button"
          >
            Ranking
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'problems' ? (
            <div className="p-4 space-y-2">
              {problems.map((problem, idx) => (
                <button
                  key={problem.id}
                  onClick={() => {
                    onProblemClick(problem.id);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    currentProblemId === problem.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {statusIcons[problem.status]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                          Q{idx + 1}.
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${difficultyColors[problem.difficulty]} text-xs`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {problem.score} pt
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
                    className={`p-3 rounded-lg border ${
                      entry.isCurrentUser
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-bold ${
                            entry.rank === 1
                              ? 'text-yellow-600'
                              : entry.rank === 2
                                ? 'text-slate-400'
                                : entry.rank === 3
                                  ? 'text-orange-600'
                                  : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          #{entry.rank}
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {entry.username}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {entry.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span>Time: {entry.timeSpent}</span>
                      <span>Solved: {entry.problemsSolved}</span>
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
