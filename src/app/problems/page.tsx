'use client';

import SortControls from '@/components/common/sort-controls';
import ProblemFilter from '@/components/problem/filter/problem-filter';
import ProblemStats from '@/components/problem/problem-stats';
import ProblemTable from '@/components/problem/problem-table';
import useProblems from '@/hooks/use-problems';
import React from 'react';

export default function ProblemsPage() {
  const {
    // State
    problems,
    pageInfo,
    totalCount,
    isLoading,
    error,

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
    handleSearch,
    handleReset,
    handleLoadMore,
  } = useProblems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-4">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-2">
                Vibe Match Problems
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Khám phá và chinh phục hàng ngàn bài tập lập trình
              </p>
            </div>
            <ProblemStats problems={problems} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-32">
              <ProblemFilter
                keyWord={keyword}
                filters={filters}
                onKeywordChange={handleKeywordChange}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onReset={handleReset}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Content - Problem List */}
          <div className="xl:col-span-3">
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <SortControls
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortByChange={handleSortByChange}
                    onSortOrderChange={handleSortOrderChange}
                  />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    {isLoading
                      ? 'Đang tải...'
                      : `${problems.length} / ${totalCount} bài tập`}
                  </span>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && problems.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Problem Table */}
              {!error && problems.length > 0 && (
                <ProblemTable
                  problems={problems}
                  hasMore={pageInfo?.hasNextPage ?? false}
                  onLoadMore={handleLoadMore}
                  isLoading={isLoading}
                  totalCount={totalCount}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
