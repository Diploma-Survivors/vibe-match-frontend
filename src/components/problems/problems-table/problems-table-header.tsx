import SortControls from '@/components/problems/problems-filter/sort-controls';
import type { SortBy, SortOrder } from '@/types/problems';
import { FaList } from 'react-icons/fa6';

interface ProblemTableHeaderProps {
  currentCount: number;
  totalCount: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (newSortBy: SortBy) => void;
  onSortOrderChange: (newSortOrder: SortOrder) => void;
}

export default function ProblemTableHeader({
  currentCount,
  totalCount,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: ProblemTableHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FaList className="text-slate-700 dark:text-slate-200" />
          <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            Danh sách bài tập
          </span>
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {currentCount}
            </span>{' '}
            / {totalCount} bài tập
          </div>
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={onSortByChange}
            onSortOrderChange={onSortOrderChange}
          />
        </div>
      </div>
    </div>
  );
}
