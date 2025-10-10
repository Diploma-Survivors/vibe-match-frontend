'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CONTEST_STATUS_COLORS, CONTEST_STATUS_LABELS } from '@/types/contests';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Star,
  Timer,
  Trophy,
  UserCheck,
  UserX,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface ContestListProps {
  contests: any[];
  isLoading: boolean;
  error: string | null;
  pageInfo: any;
  onLoadMore: () => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (minutes: number) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'upcoming':
      return <Clock className="w-4 h-4" />;
    case 'ongoing':
      return <Timer className="w-4 h-4" />;
    case 'finished':
      return <Trophy className="w-4 h-4" />;
    case 'public':
      return <Trophy className="w-4 h-4" />;
    case 'private':
      return <Trophy className="w-4 h-4" />;
    default:
      return <Trophy className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  const statusKey = status as keyof typeof CONTEST_STATUS_COLORS;
  return (
    CONTEST_STATUS_COLORS[statusKey] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  );
};

const getStatusLabel = (status: string) => {
  const statusKey = status as keyof typeof CONTEST_STATUS_LABELS;
  return CONTEST_STATUS_LABELS[statusKey] || status;
};

export default function ContestList({
  contests,
  isLoading,
  error,
  pageInfo,
  onLoadMore,
}: ContestListProps) {
  console.log('Contests:', contests);

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
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              Danh sách cuộc thi
            </h3>
          </div>

          {/* Contest Cards */}
          <div className="space-y-3">
            {contests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.01] transform-gpu mx-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* Left Section - Contest Info */}
                      <div className="flex-1 min-w-0">
                        {/* Contest Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <Link
                            href={`/contests/${contest.id}`}
                            className="text-2xl font-bold text-slate-900 dark:text-slate-100 hover:text-green-600 dark:hover:text-blue-400 transition-colors line-clamp-1 flex-1"
                          >
                            {contest.name}
                          </Link>
                        </div>

                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {/* Contest ID Badge */}
                          <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 font-mono text-sm pointer-events-none">
                            {contest.id}
                          </Badge>

                          {/* Status Badge */}
                          <Badge
                            className={`${getStatusColor(contest.status)} flex items-center gap-1 text-sm pointer-events-none`}
                          >
                            {getStatusIcon(contest.status)}
                            {getStatusLabel(contest.status)}
                          </Badge>

                          {/* User Completion Status */}
                          <Badge
                            className={
                              'flex items-center gap-1 text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 pointer-events-none'
                            }
                          >
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Đã hoàn thành
                            </>
                          </Badge>
                        </div>

                        {/* Contest Details - Inline */}
                        <div className="flex flex-wrap items-center gap-30 text-sm text-slate-600 dark:text-slate-400">
                          {/* Start Time */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-500 dark:text-slate-500 font-semibold">
                                Ngày bắt đầu
                              </span>
                              <span className="font-medium">
                                {formatDate(contest.starttime)} •{' '}
                                {formatTime(contest.starttime)}
                              </span>
                            </div>
                          </div>

                          {/* End Time */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-500 dark:text-slate-500 font-semibold">
                                Ngày kết thúc
                              </span>
                              <span className="font-medium">
                                {formatDate(contest.endtime)} •{' '}
                                {formatTime(contest.endtime)}
                              </span>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-500 dark:text-slate-500 font-semibold">
                                Thời gian làm
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                {formatDuration(contest.durationminutes)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Participation Status */}
                      <div className="flex-shrink-0">
                        {contest.userParticipated ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-200 dark:border-emerald-600/30 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 flex items-center gap-2 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Làm lại
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 dark:border-blue-600/30 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center gap-2 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <UserCheck className="w-4 h-4" />
                            Tham gia
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {(pageInfo?.hasNextPage ?? false) && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-5 h-5 mr-2" />
                    Xem thêm
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
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
