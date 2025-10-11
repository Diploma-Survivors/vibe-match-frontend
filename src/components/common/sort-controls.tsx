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
  const getSortIcon = () => {
    if (sortOrder === SortOrder.ASC) {
      return <ArrowUp className="w-4 h-4" />;
    }
    return <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Sắp xếp:
        </span>
      </div>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-48 h-10 rounded-xl border-0 bg-slate-100 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
          <SelectValue />
        </SelectTrigger>
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

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onSortOrderChange(
            sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
          )
        }
        className="flex items-center gap-2 h-10 px-4 border-0 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-105"
      >
        {getSortIcon()}
        <span className="font-medium">
          {sortOrder === SortOrder.ASC ? 'Tăng dần' : 'Giảm dần'}
        </span>
      </Button>
    </div>
  );
}
