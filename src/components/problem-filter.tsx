"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProblemFilters } from "@/types/problem";
import {
  CATEGORY_OPTIONS,
  CHAPTER_OPTIONS,
  DIFFICULTY_OPTIONS,
  PROBLEM_TYPE_OPTIONS,
  SUBJECT_OPTIONS,
} from "@/types/problem";
import { RotateCcw, Search } from "lucide-react";
import React, { useState } from "react";

interface ProblemFilterProps {
  filters: ProblemFilters;
  onFiltersChange: (filters: ProblemFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function ProblemFilter({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: ProblemFilterProps) {
  const handleFilterChange = (key: keyof ProblemFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Bộ lọc tìm kiếm
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại
          </Button>
        </div>

        <div className="space-y-4">
          {/* Mã bài */}
          <div className="space-y-2">
            <label
              htmlFor="problem-id"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mã bài:
            </label>
            <Input
              id="problem-id"
              placeholder="Nhập mã bài..."
              value={filters.id || ""}
              onChange={(e) => handleFilterChange("id", e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>

          {/* Tên bài */}
          <div className="space-y-2">
            <label
              htmlFor="problem-title"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tên bài:
            </label>
            <Input
              id="problem-title"
              placeholder="Nhập tên bài..."
              value={filters.title || ""}
              onChange={(e) => handleFilterChange("title", e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>

          {/* Mức độ */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ:
            </label>
            <Select
              value={filters.difficulty || "all"}
              onValueChange={(value) =>
                handleFilterChange("difficulty", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dạng bài */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Dạng bài:
            </label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange("category", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Tham lam" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lựa chọn môn học */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Lựa chọn môn học:
            </label>
            <Select
              value={filters.subject || "all"}
              onValueChange={(value) =>
                handleFilterChange("subject", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Lập trình cơ bản" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {SUBJECT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chương - mục */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Chương - mục:
            </label>
            <Select
              value={filters.chapter || "all"}
              onValueChange={(value) =>
                handleFilterChange("chapter", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="2. Lệnh rẽ nhánh" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {CHAPTER_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Thể loại */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Thể loại:
            </label>
            <Select
              value={filters.problemType || "all"}
              onValueChange={(value) =>
                handleFilterChange("problemType", value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {PROBLEM_TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={onSearch}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
