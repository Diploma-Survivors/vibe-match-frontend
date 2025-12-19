'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import type { ProblemFilters } from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { RotateCcw, Search } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import DifficultyFilter from './difficulty-filter';
import TagFilter from './tags-filter';
import TopicFilter from './topics-filter';

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
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

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

  // Helper function to toggle items in array filters (topicIds, tagIds)
  const toggleArrayFilter = useCallback(
    (filterKey: 'topicIds' | 'tagIds', itemId: number, isSelected: boolean) => {
      const currentItems = filters[filterKey] || [];
      const newItems = isSelected
        ? currentItems.filter((id: number) => id !== itemId)
        : [...currentItems, itemId];

      onFiltersChange({ ...filters, [filterKey]: newItems });
    },
    [filters, onFiltersChange]
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Bộ lọc tìm kiếm
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Đặt lại
        </Button>
      </div>
      {/* Buttons */}
      <div className="border-t border-slate-200 dark:border-slate-700 mb-2">
        <Button
          onClick={onSearch}
          className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition-all duration-300"
        >
          <Search className="w-5 h-5 mr-2" />
          Tìm kiếm
        </Button>
      </div>

      <div className="space-y-4">
        {/* Keyword */}
        <div className="space-y-2">
          <label
            htmlFor="problem-keyword"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Từ khóa:
          </label>
          <Input
            id="problem-keyword"
            placeholder="Nhập từ khóa..."
            value={keyWord || ''}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="h-12 rounded-lg border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
          />
        </div>

        {/* Difficulty Filter */}
        <DifficultyFilter
          selectedDifficulty={filters.difficulty}
          onDifficultyChange={(difficulty) =>
            onFiltersChange({ ...filters, difficulty })
          }
        />

        {/* Topic Filter */}
        <TopicFilter
          topics={topics}
          selectedTopicIds={filters.topicIds || []}
          isLoading={isLoadingTopics}
          onTopicToggle={(topicId, isSelected) =>
            toggleArrayFilter('topicIds', topicId, isSelected)
          }
          onClearAll={() => onFiltersChange({ ...filters, topicIds: [] })}
        />

        {/* Tag Filter */}
        <TagFilter
          tags={tags}
          selectedTagIds={filters.tagIds || []}
          isLoading={isLoadingTags}
          onTagToggle={(tagId, isSelected) =>
            toggleArrayFilter('tagIds', tagId, isSelected)
          }
          onClearAll={() => onFiltersChange({ ...filters, tagIds: [] })}
          displayLimit={3}
        />
      </div>
    </div>
  );
}
