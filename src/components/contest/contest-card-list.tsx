'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CONTEST_STATUS_COLORS, CONTEST_STATUS_LABELS } from '@/types/contests';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Timer,
  Trophy,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

interface ContestCardProps {
  contest: any;
  index: number;
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

export default function ContestCard({ contest, index }: ContestCardProps) {
  return (
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
                      {formatDate(contest.startTime)} -{' '}
                      {formatTime(contest.startTime)}
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
                      {formatDate(contest.endTime)} -{' '}
                      {formatTime(contest.endTime)}
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
                      {formatDuration(contest.durationMinutes)}
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
  );
}
