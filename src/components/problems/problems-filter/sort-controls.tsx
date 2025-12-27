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

// Removed static SORT_OPTIONS to use inside component with t()

import { useTranslation } from 'react-i18next';

export default function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortControlsProps) {
  const { t } = useTranslation('problems');

  const sortOptions = [
    { value: SortBy.TITLE, label: t('sort_options.title') },
    { value: SortBy.DIFFICULTY, label: t('sort_options.difficulty') },
    { value: SortBy.CREATED_AT, label: t('sort_options.createdAt') },
    { value: SortBy.MAX_SCORE, label: t('sort_options.maxScore') },
  ];
  const getSortIcon = () => {
    if (sortOrder === SortOrder.ASC) {
      return <ArrowUp className="w-4 h-4" />;
    }
    return <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          {t('sort_by')}:
        </span>
      </div>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-48 h-10 rounded-xl bg-background border border-border focus:ring-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
          {sortOptions.map((option) => (
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
        className="flex items-center gap-2 h-10 px-4 border border-border bg-background hover:bg-muted rounded-xl transition-all duration-200"
      >
        {getSortIcon()}
        <span className="font-medium">
          {sortOrder === SortOrder.ASC ? t('sort_asc') : t('sort_desc')}
        </span>
      </Button>
    </div>
  );
}
