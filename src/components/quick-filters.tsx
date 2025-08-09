"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProblemFilters } from "@/types/problem";
import { Filter, X } from "lucide-react";
import React from "react";

interface QuickFiltersProps {
  activeFilters: ProblemFilters;
  onRemoveFilter: (key: keyof ProblemFilters) => void;
  onClearAll: () => void;
}

const POPULAR_TAGS = [
  { key: "difficulty", value: "Dễ", label: "Dễ" },
  { key: "difficulty", value: "Trung bình", label: "Trung bình" },
  { key: "difficulty", value: "Khó", label: "Khó" },
  { key: "category", value: "Mảng 1 Chiều Cơ Bản", label: "Mảng cơ bản" },
  { key: "category", value: "Lý Thuyết Số - Toán Học", label: "Toán học" },
  { key: "problemType", value: "Cơ bản", label: "Cơ bản" },
  { key: "problemType", value: "Nâng cao", label: "Nâng cao" },
];

export default function QuickFilters({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: QuickFiltersProps) {
  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value && value.trim() !== ""
  );

  const getFilterLabel = (key: keyof ProblemFilters, value: string) => {
    switch (key) {
      case "id":
        return `ID: ${value}`;
      case "title":
        return `Tên: ${value}`;
      case "difficulty":
        return `Độ khó: ${value}`;
      case "category":
        return `Dạng: ${value}`;
      case "subject":
        return `Môn: ${value}`;
      case "chapter":
        return `Chương: ${value}`;
      case "problemType":
        return `Loại: ${value}`;
      default:
        return value;
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
          <Filter className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Bộ lọc đang áp dụng
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Active Filters */}
        {Object.entries(activeFilters).map(([key, value]) => {
          if (!value || value.trim() === "") return null;
          return (
            <div
              key={key}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-xl group hover:shadow-lg transition-all duration-200"
            >
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {getFilterLabel(key as keyof ProblemFilters, value)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg group-hover:scale-110 transition-all duration-200"
                onClick={() => onRemoveFilter(key as keyof ProblemFilters)}
              >
                <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </Button>
            </div>
          );
        })}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4 mr-2" />
            Xóa tất cả
          </Button>
        )}

        {/* Show message if no filters */}
        {!hasActiveFilters && (
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-500 dark:text-slate-400 italic">
              Chưa có bộ lọc nào được áp dụng
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
