'use client';

import ContestFilter from '@/components/contest/contest-filter';
import ContestTable from '@/components/contest/contest-table';
import useContests from '@/hooks/use-contests';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function ContestsPage() {
  const { t } = useTranslation('contests');
  const {
    // State
    contests,
    pageInfo,
    isLoading,
    error,

    // state for controlled inputs
    keyword,
    filters,

    // Actions
    handleKeywordChange,
    handleFiltersChange,
    handleReset,
    handleLoadMore,
  } = useContests();

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 lg:px-6 py-6 max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t('contests')}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {t('explore_contests')}
              </p>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Sticky */}
          <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-none">
              <ContestFilter
                keyword={keyword}
                filters={filters}
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
               <div className="p-4 rounded-lg border border-border bg-card">
                 <ContestFilter
                   keyword={keyword}
                   filters={filters}
                   onKeywordChange={handleKeywordChange}
                   onFiltersChange={handleFiltersChange}
                   onReset={handleReset}
                 />
               </div>
             </div>
            
            <ContestTable
              contests={contests}
              isLoading={isLoading}
              error={error}
              pageInfo={pageInfo}
              onLoadMore={handleLoadMore}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
