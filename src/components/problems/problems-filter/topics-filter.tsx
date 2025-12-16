'use client';

import type { Topic } from '@/types/topics';
import { AnimatePresence, motion } from 'framer-motion';

interface TopicFilterProps {
  topics: Topic[];
  selectedTopicIds: number[];
  isLoading: boolean;
  onTopicToggle: (topicId: number, isSelected: boolean) => void;
  onClearAll: () => void;
}

export default function TopicFilter({
  topics,
  selectedTopicIds,
  isLoading,
  onTopicToggle,
  onClearAll,
}: TopicFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Topic:
        </label>
        <AnimatePresence>
          {selectedTopicIds.length > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={onClearAll}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
            >
              Xóa tất cả ({selectedTopicIds.length})
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-sm text-slate-500">
          Đang tải...
        </div>
      ) : (
        <motion.div
          layout
          className="flex flex-wrap lg:grid lg:grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1"
        >
          <AnimatePresence mode="popLayout">
            {topics.map((topic) => {
              const isSelected = selectedTopicIds.includes(topic.id);

              return (
                <motion.button
                  layout
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onTopicToggle(topic.id, isSelected)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg border text-sm text-left
                    w-auto lg:w-full
                    transition-colors duration-200
                    ${
                      isSelected
                        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600 dark:hover:border-slate-500'
                    }
                  `}
                >
                  <div
                    className={`
                      w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                      ${
                        isSelected
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500'
                      }
                    `}
                  >
                    {isSelected && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        role="img"
                        aria-label="Đã chọn"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    )}
                  </div>
                  <span className="font-medium truncate">{topic.name}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
