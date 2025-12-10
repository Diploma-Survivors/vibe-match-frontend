'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortBy, SortOrder } from '@/types/problems';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import React from 'react';

interface SortControlsProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (newSortBy: SortBy) => void;
  onSortOrderChange: (newSortOrder: SortOrder) => void;
}

const SORT_OPTIONS = [
  { value: SortBy.TITLE, label: 'Tên bài' },
  { value: SortBy.DIFFICULTY, label: 'Độ khó' },
  { value: SortBy.CREATED_AT, label: 'Ngày tạo' },
  { value: SortBy.MAX_SCORE, label: 'Điểm tối đa' },
];

export default function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
          Sắp xếp:
        </span>
      </div>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <div className="relative group">
          <SelectTrigger className="w-[140px] sm:w-48 h-10 rounded-xl border-0 bg-slate-100 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200 group-hover:scale-[1.02]">
            <SelectValue />
          </SelectTrigger>
        </div>
        <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
          {SORT_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onSortOrderChange(
              sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
            )
          }
          className="flex items-center gap-2 h-10 px-4 border-0 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors duration-200"
        >
          <motion.div
            initial={false}
            animate={{ rotate: sortOrder === SortOrder.ASC ? 0 : 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {sortOrder === SortOrder.ASC ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </motion.div>
          <span className="font-medium">
            {sortOrder === SortOrder.ASC ? 'Tăng dần' : 'Giảm dần'}
          </span>
        </Button>
      </motion.div>
    </div>
  );
}
