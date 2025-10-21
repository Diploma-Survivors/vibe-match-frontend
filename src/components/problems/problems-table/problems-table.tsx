'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProblemListItem } from '@/types/problems';
import type { SortBy, SortOrder } from '@/types/problems';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProblemTableHeader from './problems-table-header';
import ProblemTableRow from './problems-table-row';

interface ProblemTableProps {
  problems: ProblemListItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
  totalCount?: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (newSortBy: SortBy) => void;
  onSortOrderChange: (newSortOrder: SortOrder) => void;
}

export default function ProblemTable({
  problems,
  hasMore,
  onLoadMore,
  isLoading = false,
  totalCount = 0,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: ProblemTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <ProblemTableHeader
        currentCount={problems.length}
        totalCount={totalCount}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={onSortByChange}
        onSortOrderChange={onSortOrderChange}
      />

      <InfiniteScroll
        dataLength={problems.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="dots-loader mb-4" />
          </div>
        }
        endMessage={
          <div className="text-center py-8 px-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-700">
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Bạn đã xem hết tất cả bài tập!
              </p>
            </div>
          </div>
        }
        scrollThreshold={0.9}
        style={{ overflow: 'visible' }}
      >
        <div className="overflow-x-auto max-w-full">
          <div className="min-w-[1000px]">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                  <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    ID
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 w-96">
                    Tên
                  </TableHead>
                  <TableHead className="w-48 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    Topic
                  </TableHead>
                  <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    % AC
                  </TableHead>
                  <TableHead className="w-24 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((problem) => (
                  <ProblemTableRow key={problem.id} problem={problem} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}
