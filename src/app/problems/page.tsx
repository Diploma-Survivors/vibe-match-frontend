'use client';

import ProblemFilter from '@/components/problems/problems-filter/problems-filter';
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
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 lg:px-6 py-6 max-w-[1600px]">
        {/* Header - Moved Up */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t('problems_list')}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {t('explore_problems')}
              </p>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Sticky */}
          <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-none">
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

          {/* Main Content */}
          <main className="flex-1 min-w-0">
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
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300">
              <ProblemTable
                problems={problems}
                hasMore={pageInfo?.hasNextPage ?? false}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                totalCount={totalCount}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={handleSortByChange}
                onSortOrderChange={handleSortOrderChange}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
