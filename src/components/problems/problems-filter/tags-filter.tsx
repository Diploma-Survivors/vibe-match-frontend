'use client';

import type { Tag } from '@/types/tags';
import { useState } from 'react';

interface TagFilterProps {
  tags: Tag[];
  selectedTagIds: number[];
  isLoading: boolean;
  onTagToggle: (tagId: number, isSelected: boolean) => void;
  onClearAll: () => void;
  displayLimit?: number;
}

export default function TagFilter({
  tags,
  selectedTagIds,
  isLoading,
  onTagToggle,
  onClearAll,
  displayLimit = 3,
}: TagFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedTags = showAll ? tags : tags.slice(0, displayLimit);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Lựa chọn tag:
        </label>
        {selectedTagIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Xóa tất cả ({selectedTagIds.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-sm text-slate-500">
          Đang tải...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {displayedTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onTagToggle(tag.id, isSelected)}
                  className={`
                    font-medium px-3 py-1 rounded-lg border text-xs inline-block
                    transition-all duration-200 hover:scale-105 hover:shadow-md
                    ${
                      isSelected
                        ? 'bg-slate-200 text-slate-700 border-2 border-slate-400 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
                    }
                  `}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>

          {tags.length > displayLimit && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
              >
                {showAll ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
