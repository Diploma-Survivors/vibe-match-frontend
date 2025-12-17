'use client';

import { type ContestListItem, ContestOverView } from '@/types/contests';
import { Trophy } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ContestCard from './contest-card-list';

interface ContestListProps {
  contests: ContestListItem[];
  isLoading: boolean;
  error: string | null;
  pageInfo: any;
  onLoadMore: () => void;
}

export default function ContestList({
  contests,
  isLoading,
  error,
  pageInfo,
  onLoadMore,
}: ContestListProps) {
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && contests.length === 0 && (
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

      {/* Contest List */}
      {!error && contests.length > 0 && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
            <h3 className="text-xl font-bold text-green-600 flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg shadow-lg shadow-emerald-500/25">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              Danh sách cuộc thi
            </h3>
          </div>

          {/* Contest Cards with Infinite Scroll */}
          <InfiniteScroll
            dataLength={contests.length}
            next={onLoadMore}
            hasMore={pageInfo?.hasNextPage ?? false}
            loader={
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="dots-loader mb-4" />
              </div>
            }
            endMessage={
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full border border-emerald-200 dark:border-emerald-700">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    Bạn đã xem hết tất cả cuộc thi!
                  </p>
                </div>
              </div>
            }
            scrollThreshold={0.9}
            style={{ overflow: 'visible' }}
          >
            <div className="space-y-3">
              {contests.map((contest, index) => (
                <ContestCard key={contest.id} contest={contest} index={index} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && contests.length === 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Không tìm thấy cuộc thi nào
          </h3>
        </div>
      )}
    </div>
  );
}
