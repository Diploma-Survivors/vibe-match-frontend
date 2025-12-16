'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import type { ProblemFilters } from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { AnimatePresence, motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 h-full"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
            <Search className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Bộ lọc tìm kiếm
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Đặt lại</span>
        </motion.button>
      </motion.div>

      <div className="space-y-6">
        {/* Keyword */}
        <motion.div variants={itemVariants} className="space-y-2">
          <label
            htmlFor="problem-keyword"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Từ khóa:
          </label>
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <Input
              id="problem-keyword"
              placeholder="Nhập từ khóa..."
              value={keyWord || ''}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="h-12 rounded-lg border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-green-500 transition-all duration-200"
            />
          </motion.div>
        </motion.div>

        {/* Difficulty Filter */}
        <motion.div variants={itemVariants}>
          <DifficultyFilter
            selectedDifficulty={filters.difficulty}
            onDifficultyChange={(difficulty) =>
              onFiltersChange({ ...filters, difficulty })
            }
          />
        </motion.div>

        {/* Topic Filter */}
        <motion.div variants={itemVariants}>
          <TopicFilter
            topics={topics}
            selectedTopicIds={filters.topicIds || []}
            isLoading={isLoadingTopics}
            onTopicToggle={(topicId, isSelected) =>
              toggleArrayFilter('topicIds', topicId, isSelected)
            }
            onClearAll={() => onFiltersChange({ ...filters, topicIds: [] })}
          />
        </motion.div>

        {/* Tag Filter */}
        <motion.div variants={itemVariants}>
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
        </motion.div>
      </div>

      {/* Buttons */}
      <motion.div
        variants={itemVariants}
        className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onSearch}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold text-white shadow-lg shadow-green-500/20"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
