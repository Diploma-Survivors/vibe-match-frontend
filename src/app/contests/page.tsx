'use client';

import { ContestFilter, ContestList } from '@/components/contest';
import { useContests } from '@/hooks';
import { motion } from 'framer-motion';
import { NotebookPen } from 'lucide-react';

export default function ContestsPage() {
  const {
    // State
    contests,
    pageInfo,
    totalCount,
    isLoading,
    error,
    filters,
    keyword,
    sortBy,
    sortOrder,

    // Actions
    handleFiltersChange,
    handleKeywordChange,
    handleSearch,
    handleReset,
    handleSortChange,
    handleLoadMore,
  } = useContests();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <NotebookPen className="w-10 h-10 text-slate-700 dark:text-slate-200" />
            Contests
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Tham gia các cuộc thi lập trình để thử thách bản thân và nâng cao kỹ
            năng
          </p>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Panel - Contest List (70%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 xl:w-[70%]"
          >
            <ContestList
              contests={contests}
              isLoading={isLoading}
              error={error}
              pageInfo={pageInfo}
              onLoadMore={handleLoadMore}
            />
          </motion.div>

          {/* Right Panel - Filter (30%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:w-[30%] xl:min-w-[400px] xl:sticky xl:top-24 xl:self-start"
          >
            <ContestFilter
              keyword={keyword}
              setKeyword={handleKeywordChange}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
