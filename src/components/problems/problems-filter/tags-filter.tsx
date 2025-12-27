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

import { useTranslation } from 'react-i18next';

export default function TagFilter({
  tags,
  selectedTagIds,
  isLoading,
  onTagToggle,
  onClearAll,
  displayLimit = 3,
}: TagFilterProps) {
  const { t } = useTranslation('problems');
  const [showAll, setShowAll] = useState(false);

  const displayedTags = showAll ? tags : tags.slice(0, displayLimit);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-foreground">
          {t('select_tags')}:
        </label>
        {selectedTagIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-xs text-destructive hover:underline font-medium transition-colors"
          >
            {t('clear_all')} ({selectedTagIds.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          {t('loading')}
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
                    cursor-pointer font-medium px-3 py-1 rounded-lg border text-xs inline-block
                    transition-all duration-200 hover:scale-105 hover:shadow-md
                    ${isSelected
                      ? 'bg-primary/10 text-primary border-primary/50 shadow-sm font-semibold'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50'
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
                className="cursor-pointer px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
              >
                {showAll ? t('show_less') : t('show_more')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
