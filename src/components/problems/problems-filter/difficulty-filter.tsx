import type { ProblemDifficulty } from '@/types/problems';
import { DIFFICULTY_OPTIONS } from '@/types/problems';

interface DifficultyFilterProps {
  selectedDifficulty?: ProblemDifficulty;
  onDifficultyChange: (difficulty?: ProblemDifficulty) => void;
}

export default function DifficultyFilter({
  selectedDifficulty,
  onDifficultyChange,
}: DifficultyFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Mức độ:
        </label>
        {selectedDifficulty && (
          <button
            type="button"
            onClick={() => onDifficultyChange(undefined)}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Xóa
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DIFFICULTY_OPTIONS.map((option) => {
          const isSelected = selectedDifficulty === option.value;
          const colorMap: Record<string, string> = {
            easy: isSelected
              ? 'bg-green-50 text-green-700 border-2 border-green-400 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600',
            medium: isSelected
              ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-400 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-500'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-yellow-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600',
            hard: isSelected
              ? 'bg-red-50 text-red-700 border-2 border-red-400 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-red-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600',
          };

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onDifficultyChange(
                  isSelected ? undefined : (option.value as ProblemDifficulty)
                )
              }
              className={`
                px-3 py-2 rounded-lg border text-xs font-medium
                transition-all duration-200 hover:scale-105
                ${colorMap[option.value]}
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
