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

interface ContestCardListProps {
  contests: any[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
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

export default function ContestCardList({
  contests,
  hasMore,
  onLoadMore,
  isLoading,
}: ContestCardListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          🏆 Danh sách cuộc thi
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
                        className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 flex-1"
                      >
                        {contest.name}
                      </Link>
                    </div>

                    {/* Badges Row */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {/* Contest ID Badge */}
                      <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 font-mono text-sm">
                        {contest.id}
                      </Badge>

                      {/* Status Badge */}
                      <Badge
                        className={`${getStatusColor(contest.status)} flex items-center gap-1 text-sm`}
                      >
                        {getStatusIcon(contest.status)}
                        {getStatusLabel(contest.status)}
                      </Badge>

                      {/* User Participation Status */}
                      {contest.userParticipated !== undefined && (
                        <Badge
                          className={`flex items-center gap-1 text-sm ${
                            contest.userParticipated
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {contest.userParticipated ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Đã tham gia
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4" />
                              Chưa tham gia
                            </>
                          )}
                        </Badge>
                      )}

                      {/* User Completion Status */}
                      {contest.userCompleted !== undefined && (
                        <Badge
                          className={`flex items-center gap-1 text-sm ${
                            contest.userCompleted
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}
                        >
                          {contest.userCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Đã hoàn thành
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Chưa hoàn thành
                            </>
                          )}
                        </Badge>
                      )}
                    </div>

                    {/* Contest Details - Inline */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      {/* Start Time */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            Bắt đầu
                          </span>
                          <span className="font-medium">
                            {formatDate(contest.starttime)} •{' '}
                            {formatTime(contest.starttime)}
                          </span>
                        </div>
                      </div>

                      {/* End Time */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            Kết thúc
                          </span>
                          <span className="font-medium">
                            {formatDate(contest.endtime)} •{' '}
                            {formatTime(contest.endtime)}
                          </span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            Thời lượng
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {formatDuration(contest.durationminutes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Virtual Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 dark:border-purple-600/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Virtual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
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
  );
}
