'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import type { ProblemFilters } from '@/types/problem-test';
import {
  CHAPTER_OPTIONS,
  DIFFICULTY_OPTIONS,
  PROBLEM_TYPE_OPTIONS,
  SUBJECT_OPTIONS,
} from '@/types/problem-test';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { RotateCcw, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

  // Fetch tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const data = await TagsService.getAllTags();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  // Fetch topics from backend
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoadingTopics(true);
        const data = await TopicsService.getAllTopics();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  const handleFilterChange = (
    key: keyof ProblemFilters,
    value: string | string[]
  ) => {
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
              value={filters.id || ''}
              onChange={(e) => handleFilterChange('id', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
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
              value={filters.title || ''}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ:
            </label>
            <Select
              value={filters.difficulty || 'all'}
              onValueChange={(value) =>
                handleFilterChange('difficulty', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg focus:bg-slate-100 dark:focus:bg-slate-700"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Topic:
            </label>
            <Select
              value={filters.topic || 'all'}
              onValueChange={(value) =>
                handleFilterChange('topic', value === 'all' ? '' : value)
              }
              disabled={isLoadingTopics}
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500">
                <SelectValue
                  placeholder={isLoadingTopics ? 'Đang tải...' : 'Tất cả'}
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                <SelectItem
                  value="all"
                  className="rounded-lg focus:bg-slate-100 dark:focus:bg-slate-700"
                >
                  Tất cả
                </SelectItem>
                {topics.map((topic) => (
                  <SelectItem
                    key={topic.id}
                    value={topic.id}
                    className="rounded-lg focus:bg-slate-100 dark:focus:bg-slate-700"
                  >
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* tag */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Lựa chọn tag:
            </label>
            <Select disabled={isLoadingTags}>
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500">
                <SelectValue
                  placeholder={
                    isLoadingTags
                      ? 'Đang tải...'
                      : filters.tags && filters.tags.length > 0
                        ? `${filters.tags.length} tag được chọn`
                        : 'Chọn tag...'
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentTags = filters.tags || [];
                      const isSelected = currentTags.includes(tag.id);

                      if (isSelected) {
                        // Remove from selection
                        const newTags = currentTags.filter((t) => t !== tag.id);
                        handleFilterChange('tags', newTags);
                      } else {
                        // Add to selection
                        const newTags = [...currentTags, tag.id];
                        handleFilterChange('tags', newTags);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const currentTags = filters.tags || [];
                        const isSelected = currentTags.includes(tag.id);

                        if (isSelected) {
                          const newTags = currentTags.filter(
                            (t) => t !== tag.id
                          );
                          handleFilterChange('tags', newTags);
                        } else {
                          const newTags = [...currentTags, tag.id];
                          handleFilterChange('tags', newTags);
                        }
                      }
                    }}
                    role="checkbox"
                    aria-checked={filters.tags?.includes(tag.id) || false}
                    tabIndex={0}
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags?.includes(tag.id) || false}
                      onChange={() => {}} // Handled by parent div onClick
                      className="w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                    />
                    <span className="text-sm">{tag.name}</span>
                  </div>
                ))}
                {filters.tags && filters.tags.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterChange('tags', []);
                      }}
                      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
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
