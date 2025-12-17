'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ContestFilters } from '@/types/contests';
import { Calendar, Filter, RotateCcw, Search } from 'lucide-react';
import React from 'react';
import StatusFilter from './status-filter';

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
    value: string | number | string[] | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleStatus = (status: string, isSelected: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = isSelected
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    handleFilterChange('status', newStatuses);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r bg-green-600">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-green-600 bg-clip-text text-transparent">
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

        {/* Buttons */}
        <div className="border-t border-slate-200 dark:border-slate-700 mb-4">
          <Button
            onClick={onSearch}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg mt-4"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        <div className="space-y-6">
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

          {/* Status Filter */}
          <StatusFilter
            selectedStatuses={filters.status || []}
            onStatusToggle={toggleStatus}
            onClearAll={() => handleFilterChange('status', [])}
          />

          {/* Start Time */}
          <div className="space-y-2">
            <label
              htmlFor="start-time"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thời gian bắt đầu:
            </label>
            <div className="relative">
              <Input
                id="start-time"
                type="datetime-local"
                value={filters.startTime || ''}
                onChange={(e) =>
                  handleFilterChange('startTime', e.target.value)
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200 pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label
              htmlFor="end-time"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thời gian kết thúc:
            </label>
            <div className="relative">
              <Input
                id="end-time"
                type="datetime-local"
                value={filters.endTime || ''}
                onChange={(e) => handleFilterChange('endTime', e.target.value)}
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200 pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
