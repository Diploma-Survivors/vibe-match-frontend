"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Problem } from "@/types/problem";
import {
  Calendar,
  CheckCircle,
  Clock,
  Hash,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

interface ProblemSidebarProps {
  problem: Problem;
}

export default function ProblemSidebar({ problem }: ProblemSidebarProps) {
  // Mock related problems
  const relatedProblems = [
    { id: "101", title: "Fibonacci Sequence", difficulty: "Dễ", solved: true },
    {
      id: "102",
      title: "Prime Numbers",
      difficulty: "Trung bình",
      solved: false,
    },
    { id: "103", title: "GCD & LCM", difficulty: "Khó", solved: false },
    {
      id: "104",
      title: "Binary Search",
      difficulty: "Trung bình",
      solved: true,
    },
  ];

  // Mock submission stats
  const submissionStats = {
    totalSubmissions: 1247,
    successfulSubmissions: 423,
    averageTime: "2.4s",
    acceptanceRate: 33.9,
  };

  return (
    <div className="space-y-6">
      {/* Problem Stats */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Thống kê bài toán
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Target className="w-4 h-4" />
              <span className="text-sm">Độ khó</span>
            </div>
            <Badge
              className={`${
                problem.difficulty === "Dễ"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : problem.difficulty === "Trung bình"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {problem.difficulty}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Thời gian TB</span>
            </div>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {submissionStats.averageTime}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">Lượt nộp</span>
            </div>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {submissionStats.totalSubmissions.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Thành công</span>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {submissionStats.successfulSubmissions.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Tỷ lệ AC</span>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {submissionStats.acceptanceRate}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Hash className="w-4 h-4" />
              <span className="text-sm">Điểm số</span>
            </div>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {problem.points}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Tỷ lệ thành công
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Accepted</span>
            <span className="text-slate-800 dark:text-slate-200">
              {submissionStats.acceptanceRate}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${submissionStats.acceptanceRate}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            {submissionStats.successfulSubmissions} /{" "}
            {submissionStats.totalSubmissions} submissions
          </div>
        </div>
      </div>

      {/* Related Problems */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Bài liên quan
        </h3>

        <div className="space-y-3">
          {relatedProblems.map((relatedProblem) => (
            <Button
              key={relatedProblem.id}
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-slate-100 dark:hover:bg-slate-700/50"
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`w-2 h-2 rounded-full ${
                    relatedProblem.solved
                      ? "bg-green-500"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                    {relatedProblem.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        relatedProblem.difficulty === "Dễ"
                          ? "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                          : relatedProblem.difficulty === "Trung bình"
                            ? "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400"
                            : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                      }`}
                    >
                      {relatedProblem.difficulty}
                    </Badge>
                    {relatedProblem.solved && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 border-slate-200 dark:border-slate-700"
        >
          Xem thêm bài tập
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Thao tác nhanh
        </h3>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start border-slate-200 dark:border-slate-700"
          >
            📚 Xem hướng dẫn
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-slate-200 dark:border-slate-700"
          >
            💡 Gợi ý thuật toán
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-slate-200 dark:border-slate-700"
          >
            🔖 Thêm vào bookmark
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-slate-200 dark:border-slate-700"
          >
            📊 Xem submission
          </Button>
        </div>
      </div>
    </div>
  );
}
