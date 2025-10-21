'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ContestFilters } from '@/types/contests';
import { Filter, RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface ContestFilterProps {
  keyword?: string;
  filters: ContestFilters;
  onKeywordChange: (keyword: string) => void;
  onFiltersChange: (filters: ContestFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function ContestFilter({
  keyword,
  filters,
  onKeywordChange,
  onFiltersChange,
  onSearch,
  onReset,
}: ContestFilterProps) {
  const handleFilterChange = (
    key: keyof ContestFilters,
    value: string | number | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Bộ lọc contest
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại
          </Button>
        </div>

        <div className="space-y-4">
          {/* Keyword Search */}
          <div className="space-y-2">
            <label
              htmlFor="contest-keyword"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tìm kiếm:
            </label>
            <Input
              id="contest-keyword"
              placeholder="Nhập từ khóa..."
              value={keyword || ''}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <label
              htmlFor="start-time"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thời gian bắt đầu:
            </label>
            <Input
              id="start-time"
              type="datetime-local"
              value={filters.startTime || ''}
              onChange={(e) => handleFilterChange('startTime', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label
              htmlFor="end-time"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thời gian kết thúc:
            </label>
            <Input
              id="end-time"
              type="datetime-local"
              value={filters.endTime || ''}
              onChange={(e) => handleFilterChange('endTime', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Min Duration */}
          <div className="space-y-2">
            <label
              htmlFor="min-duration"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thời lượng tối thiểu (phút):
            </label>
            <Input
              id="min-duration"
              type="number"
              placeholder="Nhập thời lượng..."
              value={filters.minDurationMinutes || ''}
              onChange={(e) =>
                handleFilterChange(
                  'minDurationMinutes',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Max Duration */}
          <div className="space-y-2">
            <label
              htmlFor="max-duration"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thời lượng tối đa (phút):
            </label>
            <Input
              id="max-duration"
              type="number"
              placeholder="Nhập thời lượng..."
              value={filters.maxDurationMinutes || ''}
              onChange={(e) =>
                handleFilterChange(
                  'maxDurationMinutes',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={onSearch}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
