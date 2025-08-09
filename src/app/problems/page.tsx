"use client";

import ProblemFilter from "@/components/problem-filter";
import ProblemStats from "@/components/problem-stats";
import ProblemTable from "@/components/problem-table";
import QuickFilters from "@/components/quick-filters";
import SortControls, {
  type SortField,
  type SortOrder,
} from "@/components/sort-controls";
import { mockProblems } from "@/lib/data/mock-problems";
import type { Problem, ProblemFilters } from "@/types/problem";
import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export default function ProblemsPage() {
  const [filters, setFilters] = useState<ProblemFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter and sort problems
  const filteredAndSortedProblems = useMemo(() => {
    // First filter
    const filtered = mockProblems.filter((problem) => {
      if (
        filters.id &&
        !problem.id.toLowerCase().includes(filters.id.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.title &&
        !problem.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }
      if (filters.difficulty && problem.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.category && problem.category !== filters.category) {
        return false;
      }
      if (filters.subject && problem.subject !== filters.subject) {
        return false;
      }
      if (filters.chapter && problem.chapter !== filters.chapter) {
        return false;
      }
      if (filters.problemType && problem.problemType !== filters.problemType) {
        return false;
      }
      return true;
    });

    // Then sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      // Handle special sorting for difficulty
      if (sortField === "difficulty") {
        const difficultyOrder = { Dễ: 1, "Trung bình": 2, Khó: 3 };
        aValue =
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
        bValue =
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
      }

      // Handle string sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    return filtered;
  }, [filters, sortField, sortOrder]);

  // Paginate filtered and sorted problems
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedProblems.slice(startIndex, endIndex);
  }, [filteredAndSortedProblems, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedProblems.length / ITEMS_PER_PAGE
  );

  const handleFiltersChange = (newFilters: ProblemFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    // Search is handled automatically through filtering
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleRemoveFilter = (key: keyof ProblemFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
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
            <ProblemStats problems={filteredAndSortedProblems} />
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

                <QuickFilters
                  activeFilters={filters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
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
                    {paginatedProblems.length} /{" "}
                    {filteredAndSortedProblems.length} bài tập
                  </span>
                </div>
              </div>

              {/* Problem Table */}
              <ProblemTable
                problems={paginatedProblems}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/20 dark:border-slate-700/50">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Dữ liệu được đồng bộ real-time từ Vibe Match
              </span>
            </div>
            <p className="mt-4 text-slate-500 dark:text-slate-500">
              Tổng cộng{" "}
              <strong className="text-green-600 dark:text-emerald-400">
                {mockProblems.length}
              </strong>{" "}
              bài tập từ nhiều chủ đề
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
