"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTEST_STATUS_COLORS, CONTEST_STATUS_LABELS, type Contest } from "@/types/contest";
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
    User
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                    Tham gia đấu
                </Button>
            ) : (
                <Button variant="outline" size="sm" disabled className="min-w-[100px]">
                    Chưa mở
                </Button>
            );
        case "ongoing":
            return (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]">
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
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] transform-gpu">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Left Section - Contest Info */}
                                    <div className="flex-1 min-w-0 pr-6">
                                        {/* Contest Name and Status */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <Link
                                                href={`/contests/${contest.id}`}
                                                className="text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 flex-1"
                                            >
                                                {contest.name}
                                            </Link>

                                            {/* Status Badge */}
                                            <Badge className={`${CONTEST_STATUS_COLORS[contest.status]} flex items-center gap-1`}>
                                                {getStatusIcon(contest.status)}
                                                {CONTEST_STATUS_LABELS[contest.status]}
                                            </Badge>
                                        </div>

                                        {/* Contest Details Row */}
                                        <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                                            {/* Date & Time */}
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDateTime(contest.startTime)}</span>
                                            </div>

                                            {/* Duration */}
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Thời gian làm bài: {contest.duration}</span>
                                            </div>

                                            {/* Participants */}
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    {contest.participantCount.toLocaleString()}
                                                </span>
                                                <span>thành viên</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Action Button */}
                                    <div className="flex-shrink-0">
                                        {getActionButton(contest)}
                                    </div>
                                </div>

                                {/* Writers and Virtual Badge */}
                                {(contest.writers.length > 0 || contest.isVirtual) && (
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 dark:border-slate-700/30">
                                        {/* Writers */}
                                        {contest.writers.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-500" />
                                                <div className="flex flex-wrap gap-1">
                                                    {contest.writers.slice(0, 3).map((writer) => (
                                                        <Badge
                                                            key={writer}
                                                            variant="secondary"
                                                            className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                        >
                                                            {writer}
                                                        </Badge>
                                                    ))}
                                                    {contest.writers.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                                            +{contest.writers.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Virtual Badge */}
                                        {contest.isVirtual && (
                                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-600/30">
                                                <Star className="w-3 h-3 mr-1" />
                                                Virtual
                                            </Badge>
                                        )}
                                    </div>
                                )}
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === currentPage ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(pageNum)}
                                    className={`h-8 w-8 p-0 transition-all duration-300 ${pageNum === currentPage
                                        ? "shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-500 to-purple-600"
                                        : "shadow-md hover:shadow-lg border-white/50 dark:border-slate-600/50 backdrop-blur-sm"
                                        }`}
                                >
                                    {pageNum}
                                </Button>
                            ))}
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
