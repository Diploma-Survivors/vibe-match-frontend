'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProblemDifficulty, type ProblemItemList } from '@/types/problems';
import Link from 'next/link';
import React from 'react';
import { FaList } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';

interface ProblemTableProps {
  problems: ProblemItemList[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
  totalCount?: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case ProblemDifficulty.EASY:
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case ProblemDifficulty.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case ProblemDifficulty.HARD:
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const getAcceptanceRateColor = (rate: number) => {
  if (rate >= 70) return 'text-green-600';
  if (rate >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export default function ProblemTable({
  problems,
  hasMore,
  onLoadMore,
  isLoading = false,
  totalCount = 0,
}: ProblemTableProps) {
  console.log(
    'Rendering ProblemTable with',
    problems.length,
    'problems, hasMore:',
    hasMore
  );

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaList className="text-slate-700 dark:text-slate-200" />
            <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
              Danh sách bài tập
            </span>
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {problems.length}
            </span>{' '}
            / {totalCount} bài tập
          </div>
        </div>
      </div>

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
              <span className="text-2xl">🎉</span>
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
                  {/* <TableHead className="w-16 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500"
                  />
                </TableHead> */}
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
                {problems.map((problem, index) => (
                  <TableRow
                    key={problem.id}
                    className="border-b border-slate-100/50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200 group"
                  >
                    {/* <TableCell className="text-center px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500"
                    />
                  </TableCell> */}

                    {/* ID */}
                    <TableCell className="text-center px-4 py-4">
                      <div className="inline-flex px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
                        <code className="text-green-700 dark:text-green-300 font-bold text-sm">
                          {problem.id.toString().slice(0, 8)}
                        </code>
                      </div>
                    </TableCell>

                    {/* Title and Tags */}
                    <TableCell className="px-4 py-4">
                      <div className="space-y-3">
                        <Link href={`/problems/${problem.id}/description`}>
                          <button
                            type="button"
                            className="text-left group-hover:text-green-600 dark:group-hover:text-green-400 font-bold text-base text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:underline block w-full"
                          >
                            {problem.title}
                          </button>
                        </Link>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div
                            className={`${getDifficultyColor(problem.difficulty)} font-medium px-3 py-1 rounded-lg border text-xs inline-block`}
                          >
                            {problem.difficulty}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {problem.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Topic */}
                    <TableCell className="text-center px-4 py-4">
                      <div className="space-y-2">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm break-words">
                          {problem?.topics?.at(0)?.name || 'N/A'}
                        </div>
                        {problem?.topics?.slice(1)?.map((topic) => (
                          <div
                            key={topic.id}
                            className="text-xs text-slate-600 dark:text-slate-400 break-words"
                          >
                            {topic.name}
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* Acceptance Rate */}
                    <TableCell className="text-center px-4 py-4">
                      {/* <div
                      className={`inline-flex items-center justify-center w-16 h-8 rounded-full text-xs font-bold ${problem.acceptanceRate >= 70
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                          : problem.acceptanceRate >= 40
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                        }`}
                    >
                      {problem.acceptanceRate.toFixed(1)}%
                    </div> */}
                      <div className="inline-flex items-center justify-center w-16 h-8 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                        99.9%
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center px-4 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-slate-300 accent-green-600 cursor-pointer transition-colors"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}
