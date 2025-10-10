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
import {
  CONTEST_STATUS_OPTIONS,
  PARTICIPATION_OPTIONS,
} from '@/types/contests';
import { Filter, RotateCcw, Search } from 'lucide-react';
import React from 'react';

interface ContestFilterProps {
  filters: ContestFilters;
  onFiltersChange: (filters: ContestFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function ContestFilter({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: ContestFilterProps) {
  const handleFilterChange = (key: keyof ContestFilters, value: string) => {
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
          {/* Mã contest */}
          <div className="space-y-2">
            <label
              htmlFor="contest-id"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mã contest:
            </label>
            <Input
              id="contest-id"
              placeholder="Nhập mã contest..."
              value={filters.id || ''}
              onChange={(e) => handleFilterChange('id', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Tên contest */}
          <div className="space-y-2">
            <label
              htmlFor="contest-name"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tên contest:
            </label>
            <Input
              id="contest-name"
              placeholder="Nhập tên contest..."
              value={filters.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Trạng thái contest */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Trạng thái:
            </label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                handleFilterChange('status', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {CONTEST_STATUS_OPTIONS.map((option) => (
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
          </div>

          {/* Tình trạng tham gia */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tình trạng tham gia:
            </label>
            <Select
              value={filters.participated || 'all'}
              onValueChange={(value) =>
                handleFilterChange('participated', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 transition-all duration-200">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {PARTICIPATION_OPTIONS.map((option) => (
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
