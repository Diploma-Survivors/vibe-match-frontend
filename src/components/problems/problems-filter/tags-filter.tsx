'use client';

import type { Tag } from '@/types/tags';
import { AnimatePresence, motion } from 'framer-motion';
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
        <AnimatePresence>
          {selectedTagIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              type="button"
              onClick={onClearAll}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
            >
              Xóa tất cả ({selectedTagIds.length})
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-sm text-slate-500">
          Đang tải...
        </div>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <AnimatePresence mode="popLayout">
              {displayedTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);

                return (
                  <motion.button
                    layout
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onTagToggle(tag.id, isSelected)}
                    className={`
                      font-medium px-3 py-1 rounded-lg border text-xs inline-block text-center
                      transition-colors duration-200
                      ${
                        isSelected
                          ? 'bg-slate-200 text-slate-700 border-2 border-slate-400 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
                      }
                    `}
                  >
                    {tag.name}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {tags.length > displayLimit && (
            <div className="flex justify-center pt-2">
              <motion.button
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
              >
                {showAll ? 'Thu gọn' : 'Xem thêm'}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
