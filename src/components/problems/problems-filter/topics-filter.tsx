'use client';

import type { Topic } from '@/types/topics';

interface TopicFilterProps {
  topics: Topic[];
  selectedTopicIds: number[];
  isLoading: boolean;
  onTopicToggle: (topicId: number, isSelected: boolean) => void;
  onClearAll: () => void;
}

import { useTranslation } from 'react-i18next';

export default function TopicFilter({
  topics,
  selectedTopicIds,
  isLoading,
  onTopicToggle,
  onClearAll,
}: TopicFilterProps) {
  const { t } = useTranslation('problems');
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-foreground">
          {t('topic_label')}:
        </label>
        {selectedTopicIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-xs text-destructive hover:underline font-medium transition-colors"
          >
            {t('clear_all')} ({selectedTopicIds.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          {t('loading')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
          {topics.map((topic) => {
            const isSelected = selectedTopicIds.includes(topic.id);

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onTopicToggle(topic.id, isSelected)}
                className={`
                  cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm
                  transition-all duration-200 hover:scale-[1.02]
                  ${isSelected
                    ? 'bg-primary/5 border-primary/50 shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-border/80'
                  }
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-background border-muted-foreground/30'
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      role="img"
                      aria-label={t('selected')}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{topic.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
