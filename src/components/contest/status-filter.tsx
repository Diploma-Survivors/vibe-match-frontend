'use client';

import { CONTEST_STATUS_OPTIONS } from '@/types/contests';
import { Check } from 'lucide-react';

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusToggle: (status: string, isSelected: boolean) => void;
  onClearAll: () => void;
}

const CONTEST_STATUS_FILTER_OPTIONS = [
  { value: 'upcoming', label: 'Sắp diễn ra' },
  { value: 'ongoing', label: 'Đang diễn ra' },
  { value: 'ended', label: 'Đã kết thúc' },
];

export default function StatusFilter({
  selectedStatuses,
  onStatusToggle,
  onClearAll,
}: StatusFilterProps) {
  // Filter out 'all' from options as we handle it via empty selection or specific logic
  const options = CONTEST_STATUS_FILTER_OPTIONS;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Trạng thái:
        </label>
        {selectedStatuses.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Xóa tất cả ({selectedStatuses.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const isSelected = selectedStatuses.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusToggle(option.value, isSelected)}
              className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm
                  transition-all duration-200 hover:scale-[1.02]
                  bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 
                  dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600 dark:hover:border-slate-500
                `}
            >
              <div
                className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${
                      isSelected
                        ? 'bg-green-500 border-green-500'
                        : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500'
                    }
                  `}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
