'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CONTEST_STATUS_COLORS,
  CONTEST_STATUS_LABELS,
  type Contest,
} from '@/types/contests';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ContestTableProps {
  contests: Contest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  title: string;
}

const getActionButton = (contest: Contest) => {
  switch (contest.status) {
    case 'upcoming':
      return contest.registrationOpen ? (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Đăng ký
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Chưa mở
        </Button>
      );
    case 'ongoing':
      return (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Tham gia
        </Button>
      );
    case 'finished':
      return (
        <Button variant="outline" size="sm">
          Kết quả
        </Button>
      );
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ContestTable({
  contests,
  currentPage,
  totalPages,
  onPageChange,
  title,
}: ContestTableProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/40 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/15 dark:hover:shadow-slate-900/50 transform-gpu">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-white/30 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/90 via-white/95 to-slate-50/90 dark:from-slate-700/50 dark:via-slate-800/70 dark:to-slate-700/50 backdrop-blur-sm">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 via-white/90 to-slate-50/80 dark:from-slate-700/20 dark:via-slate-800/30 dark:to-slate-700/20 backdrop-blur-sm">
              <TableHead className="w-16 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3">
                <div className="p-1 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-md shadow-sm">
                  <Trophy className="w-4 h-4 mx-auto text-emerald-600 dark:text-emerald-400" />
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-2 py-3 min-w-[200px]">
                Tên cuộc thi
              </TableHead>
              <TableHead className="w-28 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3 hidden sm:table-cell">
                Ngày thi
              </TableHead>
              <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3 hidden md:table-cell">
                Giờ
              </TableHead>
              <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3 hidden lg:table-cell">
                Thời lượng
              </TableHead>
              <TableHead className="w-24 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3 hidden lg:table-cell">
                Thí sinh
              </TableHead>
              <TableHead className="w-32 font-bold text-slate-700 dark:text-slate-300 px-2 py-3 hidden xl:table-cell">
                Writer(s)
              </TableHead>
              <TableHead className="w-24 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3">
                Trạng thái
              </TableHead>
              <TableHead className="w-28 font-bold text-slate-700 dark:text-slate-300 text-center px-2 py-3">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contests.map((contest, index) => (
              <TableRow
                key={contest.id}
                className="border-b border-white/10 dark:border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-50/80 hover:via-white/90 hover:to-slate-50/80 dark:hover:from-slate-700/20 dark:hover:via-slate-800/30 dark:hover:to-slate-700/20 transition-all duration-300 group hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-slate-900/20 backdrop-blur-sm"
              >
                {/* Icon */}
                <TableCell className="text-center px-2 py-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/30 dark:via-emerald-800/40 dark:to-emerald-700/50 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </TableCell>

                {/* Contest Name */}
                <TableCell className="px-2 py-4">
                  <div className="space-y-1">
                    <Link
                      href={`/contests/${contest.id}`}
                      className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {contest.name}
                    </Link>
                    {contest.isVirtual && (
                      <Badge
                        variant="outline"
                        className="text-xs text-purple-600 border-purple-200"
                      >
                        Virtual
                      </Badge>
                    )}
                    {contest.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {contest.description}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="text-center px-2 py-4 hidden sm:table-cell">
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(contest.startTime)}</span>
                  </div>
                </TableCell>

                {/* Time */}
                <TableCell className="text-center px-2 py-4 hidden md:table-cell">
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(contest.startTime)}</span>
                  </div>
                </TableCell>

                {/* Duration */}
                <TableCell className="text-center px-2 py-4 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{contest.duration}</span>
                  </div>
                </TableCell>

                {/* Participants */}
                <TableCell className="text-center px-2 py-4 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Users className="w-3 h-3" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {contest.participantCount.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                {/* Writers */}
                <TableCell className="px-2 py-4 hidden xl:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {contest.writers.slice(0, 2).map((writer) => (
                      <Badge
                        key={writer}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {writer}
                      </Badge>
                    ))}
                    {contest.writers.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        +{contest.writers.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center px-2 py-4">
                  <Badge className={CONTEST_STATUS_COLORS[contest.status]}>
                    {CONTEST_STATUS_LABELS[contest.status]}
                  </Badge>
                </TableCell>

                {/* Action */}
                <TableCell className="text-center px-2 py-4">
                  {getActionButton(contest)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 via-white/90 to-slate-50/80 dark:from-slate-700/20 dark:via-slate-800/30 dark:to-slate-700/20 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 px-3 shadow-md hover:shadow-lg transition-all duration-300 border-white/50 dark:border-slate-600/50 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`h-8 w-8 p-0 transition-all duration-300 ${
                      pageNum === currentPage
                        ? 'shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'shadow-md hover:shadow-lg border-white/50 dark:border-slate-600/50 backdrop-blur-sm'
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 px-3 shadow-md hover:shadow-lg transition-all duration-300 border-white/50 dark:border-slate-600/50 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
