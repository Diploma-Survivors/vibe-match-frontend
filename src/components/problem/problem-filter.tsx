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
import {
  DIFFICULTY_OPTIONS,
  type ProblemDifficulty,
  type ProblemFilters,
  type ProblemType,
  TYPE_OPTIONS,
} from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { RotateCcw, Search } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

interface ProblemFilterProps {
  keyWord: string;
  filters: ProblemFilters;
  onKeywordChange: (newKeyword: string) => void;
  onFiltersChange: (newFilters: ProblemFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function ProblemFilter({
  keyWord,
  filters,
  onKeywordChange,
  onFiltersChange,
  onSearch,
  onReset,
  isLoading,
}: ProblemFilterProps) {
  // state for tags and topics to display in filter options
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);
  const TAG_DISPLAY_LIMIT = 3;

  // Fetch tags and topics from backend
  const fetchTagsAndTopics = useCallback(async () => {
    setIsLoadingTags(true);
    setIsLoadingTopics(true);

    try {
      const [tagsData, topicsData] = await Promise.all([
        TagsService.getAllTags(),
        TopicsService.getAllTopics(),
      ]);
      setTags(tagsData);
      setTopics(topicsData);
    } catch (error) {
      console.error('Error fetching tags or topics:', error);
    } finally {
      setIsLoadingTags(false);
      setIsLoadingTopics(false);
    }
  }, []);

  useEffect(() => {
    fetchTagsAndTopics();
  }, [fetchTagsAndTopics]);

  // Tạo màu sắc dựa trên tên tag (hash-based color)
  const getTagColor = (tagName: string) => {
    const colors = [
      {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-400',
        darkBg: 'dark:bg-blue-900/20',
        darkText: 'dark:text-blue-300',
        darkBorder: 'dark:border-blue-500',
      },
      {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-400',
        darkBg: 'dark:bg-purple-900/20',
        darkText: 'dark:text-purple-300',
        darkBorder: 'dark:border-purple-500',
      },
      {
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        border: 'border-pink-400',
        darkBg: 'dark:bg-pink-900/20',
        darkText: 'dark:text-pink-300',
        darkBorder: 'dark:border-pink-500',
      },
      {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-400',
        darkBg: 'dark:bg-rose-900/20',
        darkText: 'dark:text-rose-300',
        darkBorder: 'dark:border-rose-500',
      },
      {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-400',
        darkBg: 'dark:bg-orange-900/20',
        darkText: 'dark:text-orange-300',
        darkBorder: 'dark:border-orange-500',
      },
      {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-400',
        darkBg: 'dark:bg-amber-900/20',
        darkText: 'dark:text-amber-300',
        darkBorder: 'dark:border-amber-500',
      },
      {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-400',
        darkBg: 'dark:bg-yellow-900/20',
        darkText: 'dark:text-yellow-300',
        darkBorder: 'dark:border-yellow-500',
      },
      {
        bg: 'bg-lime-50',
        text: 'text-lime-700',
        border: 'border-lime-400',
        darkBg: 'dark:bg-lime-900/20',
        darkText: 'dark:text-lime-300',
        darkBorder: 'dark:border-lime-500',
      },
      {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-400',
        darkBg: 'dark:bg-green-900/20',
        darkText: 'dark:text-green-300',
        darkBorder: 'dark:border-green-500',
      },
      {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-400',
        darkBg: 'dark:bg-emerald-900/20',
        darkText: 'dark:text-emerald-300',
        darkBorder: 'dark:border-emerald-500',
      },
      {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-400',
        darkBg: 'dark:bg-teal-900/20',
        darkText: 'dark:text-teal-300',
        darkBorder: 'dark:border-teal-500',
      },
      {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-400',
        darkBg: 'dark:bg-cyan-900/20',
        darkText: 'dark:text-cyan-300',
        darkBorder: 'dark:border-cyan-500',
      },
      {
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-400',
        darkBg: 'dark:bg-sky-900/20',
        darkText: 'dark:text-sky-300',
        darkBorder: 'dark:border-sky-500',
      },
      {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-400',
        darkBg: 'dark:bg-indigo-900/20',
        darkText: 'dark:text-indigo-300',
        darkBorder: 'dark:border-indigo-500',
      },
      {
        bg: 'bg-violet-50',
        text: 'text-violet-700',
        border: 'border-violet-400',
        darkBg: 'dark:bg-violet-900/20',
        darkText: 'dark:text-violet-300',
        darkBorder: 'dark:border-violet-500',
      },
      {
        bg: 'bg-fuchsia-50',
        text: 'text-fuchsia-700',
        border: 'border-fuchsia-400',
        darkBg: 'dark:bg-fuchsia-900/20',
        darkText: 'dark:text-fuchsia-300',
        darkBorder: 'dark:border-fuchsia-500',
      },
    ];

    // Hash function to consistently assign a color based on tag name
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
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
          {/* Từ khóa */}
          <div className="space-y-2">
            <label
              htmlFor="problem-title"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Từ khóa:
            </label>
            <Input
              id="problem-keyword"
              placeholder="Nhập từ khóa..."
              value={keyWord || ''}
              onChange={(e) => onKeywordChange(e.target.value)}
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
                onFiltersChange({
                  ...filters,
                  difficulty:
                    value === 'all' ? undefined : (value as ProblemDifficulty),
                })
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

          {/* Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Loại bài:
            </label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  type: value === 'all' ? undefined : (value as ProblemType),
                })
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {TYPE_OPTIONS.map((option) => (
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
              value={
                filters.topicIds && filters.topicIds.length > 0
                  ? filters.topicIds[0]
                  : 'all'
              }
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  topicIds: value === 'all' ? [] : [value],
                })
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Lựa chọn tag:
              </label>
              {filters.tagIds && filters.tagIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, tagIds: [] })}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Xóa tất cả ({filters.tagIds.length})
                </button>
              )}
            </div>
            {isLoadingTags ? (
              <div className="p-4 text-center text-sm text-slate-500">
                Đang tải...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(showAllTags ? tags : tags.slice(0, TAG_DISPLAY_LIMIT)).map(
                    (tag) => {
                      const isSelected =
                        filters.tagIds?.includes(tag.id) || false;
                      const colorScheme = getTagColor(tag.name);

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const currentTags = filters.tagIds || [];
                            if (isSelected) {
                              const newTags = currentTags.filter(
                                (t: string) => t !== tag.id
                              );
                              onFiltersChange({ ...filters, tagIds: newTags });
                            } else {
                              const newTags = [...currentTags, tag.id];
                              onFiltersChange({ ...filters, tagIds: newTags });
                            }
                          }}
                          className={`
                            font-medium px-3 py-1 rounded-lg border text-xs inline-block
                            transition-all duration-200 hover:scale-105 hover:shadow-md
                            ${
                              isSelected
                                ? `${colorScheme.bg} ${colorScheme.text} border-2 ${colorScheme.border} ${colorScheme.darkBg} ${colorScheme.darkText} ${colorScheme.darkBorder} shadow-sm`
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
                            }
                          `}
                        >
                          {tag.name}
                        </button>
                      );
                    }
                  )}
                </div>
                {tags.length > TAG_DISPLAY_LIMIT && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                    >
                      {showAllTags ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                )}
              </>
            )}
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
