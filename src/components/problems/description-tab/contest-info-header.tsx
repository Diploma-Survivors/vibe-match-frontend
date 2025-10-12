import { Timer, Trophy } from 'lucide-react';

interface ContestInfoHeaderProps {
  contestName: string;
  contestTimeRemaining?: string;
}

export function ContestInfoHeader({
  contestName,
  contestTimeRemaining,
}: ContestInfoHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-700/50 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {contestName}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Contest Problems
            </p>
          </div>
        </div>
        {contestTimeRemaining && (
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
            <Timer className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-600">
              Time Remaining: {contestTimeRemaining}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
