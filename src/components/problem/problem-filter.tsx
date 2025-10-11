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

  return (
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ:
            </label>
            {filters.difficulty && (
              <button
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, difficulty: undefined })
                }
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                Xóa
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['easy', 'medium', 'hard'].map((level) => {
              const isSelected = filters.difficulty === level;
              const labels = {
                easy: 'Dễ',
                medium: 'Trung bình',
                hard: 'Khó',
              };
              const colors = {
                easy: isSelected
                  ? 'bg-green-50 text-green-700 border-2 border-green-400 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600',
                medium: isSelected
                  ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-400 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-500'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-yellow-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600',
                hard: isSelected
                  ? 'bg-red-50 text-red-700 border-2 border-red-400 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-red-300 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600',
              };

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      difficulty: isSelected
                        ? undefined
                        : (level as ProblemDifficulty),
                    })
                  }
                  className={`
                    px-3 py-2 rounded-lg border text-xs font-medium
                    transition-all duration-200 hover:scale-105
                    ${colors[level as keyof typeof colors]}
                  `}
                >
                  {labels[level as keyof typeof labels]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Topic:
            </label>
            {filters.topicIds && filters.topicIds.length > 0 && (
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, topicIds: [] })}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
              >
                Xóa tất cả ({filters.topicIds.length})
              </button>
            )}
          </div>
          {isLoadingTopics ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Đang tải...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {topics.map((topic) => {
                const isSelected =
                  filters.topicIds?.includes(topic.id) || false;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      const currentTopics = filters.topicIds || [];
                      if (isSelected) {
                        const newTopics = currentTopics.filter(
                          (t: string) => t !== topic.id
                        );
                        onFiltersChange({ ...filters, topicIds: newTopics });
                      } else {
                        const newTopics = [...currentTopics, topic.id];
                        onFiltersChange({ ...filters, topicIds: newTopics });
                      }
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm
                      transition-all duration-200 hover:scale-[1.02]
                      bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 
                      dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600 dark:hover:border-slate-500
                    `}
                  >
                    <div
                      className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                      ${
                        isSelected
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500'
                      }
                    `}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          role="img"
                          aria-label="Đã chọn"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{topic.name}</span>
                  </button>
                );
              })}
            </div>
          )}
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
                                ? 'bg-slate-200 text-slate-700 border-2 border-slate-400 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 shadow-sm'
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
  );
}
