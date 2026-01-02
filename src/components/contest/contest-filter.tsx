'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ContestFilters } from '@/types/contests';
import { RotateCcw, Search, Calendar, CheckCircle2, Circle, Clock, Timer, History } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ContestFilterProps {
  keyword?: string;
  filters: ContestFilters;
  onKeywordChange: (keyword: string) => void;
  onFiltersChange: (filters: ContestFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export default function ContestFilter({
  keyword,
  filters,
  onKeywordChange,
  onFiltersChange,
  onReset,
  isLoading,
}: ContestFilterProps) {
  const { t } = useTranslation('contests');

  const handleFilterChange = (
    key: keyof ContestFilters,
    value: string | number | string[] | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleStatus = (status: string) => {
    const currentStatuses = filters.status || [];
    const isSelected = currentStatuses.includes(status);
    const newStatuses = isSelected
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    handleFilterChange('status', newStatuses.length > 0 ? newStatuses : undefined);
  };

  const STATUS_OPTIONS = [
    { value: 'upcoming', label: t('upcoming'), icon: Clock, color: 'text-blue-500 bg-blue-500/10 border-blue-200' },
    { value: 'ongoing', label: t('ongoing'), icon: Timer, color: 'text-green-500 bg-green-500/10 border-green-200' },
    { value: 'ended', label: t('ended'), icon: History, color: 'text-muted-foreground bg-muted border-transparent' },
  ];

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          {t('filters')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          {t('reset')}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('search_placeholder')}
          value={keyword || ''}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9 h-10 bg-background text-sm"
        />
      </div>

      <div className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('status')}
            </label>
             {filters.status && filters.status.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleFilterChange('status', undefined)}
                  className="text-[10px] font-medium text-muted-foreground hover:text-foreground"
                >
                  {t('clear')}
                </button>
              )}
          </div>
          <div className="flex flex-col gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = filters.status?.includes(option.value);
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleStatus(option.value)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                    isSelected
                      ? option.color
                      : "bg-background text-muted-foreground border-transparent hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Time */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('start_time')}
            </label>
            <div className="relative">
              <Input
                type="datetime-local"
                value={filters.startTime || ''}
                onChange={(e) =>
                  handleFilterChange('startTime', e.target.value)
                }
                className="h-9 text-xs pl-2" // simplified
              />
            </div>
        </div>

        {/* End Time */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('end_time')}
            </label>
            <div className="relative">
              <Input
                type="datetime-local"
                value={filters.endTime || ''}
                onChange={(e) => handleFilterChange('endTime', e.target.value)}
                className="h-9 text-xs pl-2" // simplified
              />
            </div>
        </div>
      </div>
    </div>
  );
}
