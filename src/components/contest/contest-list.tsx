'use client';

import { useContests } from '@/hooks';
import { motion } from 'framer-motion';
import ContestCardList from './contest-card-list';

const ITEMS_PER_PAGE = 20;

interface ContestListProps {
  contests: any[];
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ContestCardList
            contests={contests}
            hasMore={pageInfo?.hasNextPage ?? false}
            onLoadMore={onLoadMore}
            isLoading={isLoading}
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && contests.length === 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Không tìm thấy cuộc thi nào
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Hãy thử thay đổi bộ lọc để tìm kiếm cuộc thi phù hợp
          </p>
        </div>
      )}
    </div>
  );
}
