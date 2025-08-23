"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CONTEST_STATUS_COLORS,
  CONTEST_STATUS_LABELS,
  type Contest,
} from "@/types/contest";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  Users,
  Star,
  Timer,
  Medal,
  User,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

interface ContestCardListProps {
  contests: Contest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  title: string;
}

const getActionButton = (contest: Contest) => {
  switch (contest.status) {
    case "upcoming":
      return contest.registrationOpen ? (
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
        >
          Tham gia đấu
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="min-w-[100px]">
          Chưa mở
        </Button>
      );
    case "ongoing":
      return (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
        >
          Tham gia
        </Button>
      );
    case "finished":
      return (
        <Button variant="outline" size="sm" className="min-w-[100px]">
          Tham gia đấu
        </Button>
      );
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "upcoming":
      return <Clock className="w-4 h-4" />;
    case "ongoing":
      return <Timer className="w-4 h-4" />;
    case "finished":
      return <Medal className="w-4 h-4" />;
    default:
      return <Trophy className="w-4 h-4" />;
  }
};

export default function ContestCardList({
  contests,
  currentPage,
  totalPages,
  onPageChange,
  title,
}: ContestCardListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          {title}
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
                        className={`${CONTEST_STATUS_COLORS[contest.status]} flex items-center gap-1 text-sm`}
                      >
                        {getStatusIcon(contest.status)}
                        {CONTEST_STATUS_LABELS[contest.status]}
                      </Badge>

                      {/* User Participation Status */}
                      {contest.userParticipated !== undefined && (
                        <Badge
                          className={`flex items-center gap-1 text-sm ${
                            contest.userParticipated
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
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
                    <div className="flex items-center gap-6 text-base text-slate-600 dark:text-slate-400">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>
                          {formatDate(contest.startTime)} •{" "}
                          {formatTime(contest.startTime)}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {contest.duration}
                        </span>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
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
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`h-8 w-8 p-0 transition-all duration-300 ${
                      pageNum === currentPage
                        ? "shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-500 to-purple-600"
                        : "shadow-md hover:shadow-lg border-white/50 dark:border-slate-600/50 backdrop-blur-sm"
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
