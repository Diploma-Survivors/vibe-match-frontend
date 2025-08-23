"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Problem } from "@/types/problem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ProblemTableProps {
  problems: Problem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Dễ":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Trung bình":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Khó":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getAcceptanceRateColor = (rate: number) => {
  if (rate >= 70) return "text-green-600";
  if (rate >= 40) return "text-yellow-600";
  return "text-red-600";
};

export default function ProblemTable({
  problems,
  currentPage,
  totalPages,
  onPageChange,
}: ProblemTableProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
          📚 Danh sách bài tập
        </h3>
      </div>

      <div className="overflow-x-auto max-w-full">
        <div className="min-w-[1000px]">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                <TableHead className="w-16 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500"
                  />
                </TableHead>
                <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  ID
                </TableHead>
                <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 w-96">
                  Bài tập
                </TableHead>
                <TableHead className="w-32 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  Nhóm
                </TableHead>
                <TableHead className="w-32 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  Dạng
                </TableHead>
                <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  Điểm
                </TableHead>
                <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  % AC
                </TableHead>
                <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  # AC
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
                  <TableCell className="text-center px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500"
                    />
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="inline-flex px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
                      <code className="text-green-700 dark:text-green-300 font-bold text-sm">
                        {problem.id}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="space-y-3">
                      <Link href={`/problems/${problem.id}`}>
                        <button
                          type="button"
                          className="text-left group-hover:text-green-600 dark:group-hover:text-green-400 font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:underline block w-full"
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
                          {problem.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 2 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              +{problem.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm break-words">
                        {problem.group}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 break-words">
                        {problem.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm break-words">
                        {problem.category}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 break-words">
                        {problem.chapter}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="inline-flex items-center justify-center w-16 h-10 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                      <span className="font-bold text-yellow-700 dark:text-yellow-300 text-sm">
                        {problem.points.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-8 rounded-full text-xs font-bold ${
                        problem.acceptanceRate >= 70
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                          : problem.acceptanceRate >= 40
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
                      }`}
                    >
                      {problem.acceptanceRate.toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="inline-flex items-center justify-center w-16 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border border-green-200 dark:border-green-700">
                      <span className="font-bold text-green-700 dark:text-green-300 text-xs">
                        {problem.submissionCount.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-700 group-hover:scale-110 transition-transform duration-200">
                      <div className="w-3 h-3 rounded-full border-2 border-red-500 dark:border-red-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-700/10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 p-0 rounded-xl transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                        : "border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Trang{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {currentPage}
            </span>{" "}
            /{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
