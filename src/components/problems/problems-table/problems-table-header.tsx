import { FaList } from 'react-icons/fa6';

interface ProblemTableHeaderProps {
  currentCount: number;
  totalCount: number;
}

export default function ProblemTableHeader({
  currentCount,
  totalCount,
}: ProblemTableHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FaList className="text-slate-700 dark:text-slate-200" />
          <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            Danh sách bài tập
          </span>
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {currentCount}
          </span>{' '}
          / {totalCount} bài tập
        </div>
      </div>
    </div>
  );
}
