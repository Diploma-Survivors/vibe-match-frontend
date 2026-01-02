'use client';

import ProblemFilter from '@/components/problems/problems-filter/problems-filter';
import SortControls from '@/components/problems/problems-filter/sort-controls';
import ProblemTable from '@/components/problems/problems-table/problems-table';
import { Button } from '@/components/ui/button';
import useProblems from '@/hooks/use-problems';
import { cn } from '@/lib/utils';
import { LayoutGrid, List } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProblemsPage() {
  const { t } = useTranslation('problems');
  const {
    // State
    problems,
    pageInfo,
    totalCount,
    isLoading,
    error,

    // Metadata
    tags,
    topics,
    isMetadataLoading,

    // Request params (exposed for UI)
    filters,
    keyword,
    sortBy,
    sortOrder,

    // Handlers
    handleFiltersChange,
    handleKeywordChange,
    handleSortByChange,
    handleSortOrderChange,
    handleReset,
    handleLoadMore,
  } = useProblems();

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="container mx-auto px-4 lg:px-6 h-full max-w-[1600px]">
        <div className="flex h-full gap-6 pt-6">
          {/* Left Sidebar - Fixed */}
          <aside className="hidden lg:flex w-[260px] xl:w-[280px] shrink-0 flex-col gap-6 h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
              <ProblemFilter
                keyWord={keyword}
                filters={filters}
                tags={tags}
                topics={topics}
                isLoading={isMetadataLoading}
                onKeywordChange={handleKeywordChange}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Main Content - Scrollable */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-none" id="problems-main-scroll">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {t('problems_list')}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {t('explore_problems')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SortControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortByChange={handleSortByChange}
                  onSortOrderChange={handleSortOrderChange}
                />
              </div>
            </div>

            {/* Mobile Filter Trigger (Visible only on mobile) */}
            <div className="lg:hidden mb-6">
              {/* TODO: Add Sheet/Drawer for mobile filters */}
              <div className="p-4 rounded-lg border border-border bg-card">
                <ProblemFilter
                  keyWord={keyword}
                  filters={filters}
                  tags={tags}
                  topics={topics}
                  isLoading={isMetadataLoading}
                  onKeywordChange={handleKeywordChange}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center mb-6">
                <p className="text-destructive font-medium">{error}</p>
                <Button variant="outline" size="sm" onClick={handleReset} className="mt-4">
                  {t('try_again')}
                </Button>
              </div>
            )}

            {/* Problem Table */}
            <div className="rounded-xl border border-border shadow-sm bg-card">
              <ProblemTable
                problems={problems}
                hasMore={pageInfo?.hasNextPage ?? false}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                totalCount={totalCount}
                scrollableTarget="problems-main-scroll"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
