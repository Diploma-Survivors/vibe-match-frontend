'use client';

import { SortControls } from '@/components/common';
import type { SortField, SortOrder } from '@/components/common/sort-controls';
import { ProblemFilter, ProblemTable } from '@/components/problem';
import { ProblemsService } from '@/services/problems-service';
import type { ProblemFilters } from '@/types/problem-test';
import {
  type GetProblemListRequest,
  type PageInfo,
  ProblemEndpointType,
  type ProblemItemList,
  type ProblemListResponse,
} from '@/types/problems';
import { BookOpen } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 2;

export default function ProblemsPage() {
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<ProblemItemList[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProblemFilters>({});
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [getProblemsRequest, setGetProblemsRequest] =
    useState<GetProblemListRequest>({
      first: ITEMS_PER_PAGE,
    });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);

        const axiosResponse = await ProblemsService.getProblemList(
          getProblemsRequest,
          ProblemEndpointType.TRAINING
        );
        const response: ProblemListResponse = axiosResponse?.data?.data;

        // Extract problems from edges
        const problemsData = response?.edges?.map((edge) => ({
          ...edge.node,
        }));

        setProblems(problemsData);
        setPageInfo(response?.pageInfos);
        setTotalCount(response?.totalCount);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError("Can't load the problems.");
        setProblems([]);
        setPageInfo(null);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [getProblemsRequest]);

  // Tính toán tổng số trang dựa trên totalCount từ API
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (isLoading) return;

    // Nếu đi tới trang tiếp theo
    if (page > currentPage && pageInfo?.hasNextPage) {
      setGetProblemsRequest((prev) => ({
        ...prev,
        after: pageInfo.endCursor,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      }));
      setCurrentPage(page);
    }
    // Nếu quay lại trang trước
    else if (page < currentPage && pageInfo?.hasPreviousPage) {
      setGetProblemsRequest((prev) => ({
        ...prev,
        before: pageInfo.startCursor,
        after: undefined,
        first: undefined,
        last: ITEMS_PER_PAGE,
      }));
      setCurrentPage(page);
    }
  };

  const handleFiltersChange = (newFilters: ProblemFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    // Reset về trang đầu tiên khi thay đổi filter
    setGetProblemsRequest({
      first: ITEMS_PER_PAGE,
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // TODO: Implement search with API
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
    setGetProblemsRequest({
      first: ITEMS_PER_PAGE,
    });
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
    // TODO: Implement sorting with API
  };

  const handleRemoveFilter = (key: keyof ProblemFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: '',
    }));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 pt-4">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Vibe Match Problems
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Khám phá và chinh phục hàng ngàn bài tập lập trình
              </p>
            </div>
            {/* <ProblemStats problems={problems} /> */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Tổng bài
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {totalCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-32 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:custom-scrollbar xl:pr-2">
              <div className="space-y-6">
                <ProblemFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>

          {/* Right Content - Problem List */}
          <div className="xl:col-span-3">
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <SortControls
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
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
              {isLoading && (
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
              {!isLoading && !error && (
                <ProblemTable
                  problems={problems}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                  pageInfo={pageInfo}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
