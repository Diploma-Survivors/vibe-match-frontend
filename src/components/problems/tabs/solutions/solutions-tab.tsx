'use client';

import { ResizableDivider } from '@/components/problems/tabs/description/dividers/resizable-divider';
import { useResizable } from '@/hooks/use-resizable';
import useSolutions from '@/hooks/use-solutions';
import { SubmissionsService } from '@/services/submissions-service';
import { SubmissionStatus } from '@/types/submissions';
import { useEffect, useState } from 'react';
import SolutionDetailPanel from './solution-detail-panel';
import SolutionFilter from './solution-filter';
import SolutionList from './solution-list';

interface SolutionsTabProps {
  problemId: string;
}

export default function SolutionsTab({ problemId }: SolutionsTabProps) {
  const {
    solutions,
    isLoading,
    pageInfo,
    filters,
    keyword,
    sortBy,
    handleFiltersChange,
    handleKeywordChange,
    handleSortByChange,
    handleSearch,
    handleLoadMore,
    refresh,
  } = useSolutions(problemId);

  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(
    null
  );
  const [acceptedSubmissionId, setAcceptedSubmissionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const checkACStatus = async () => {
      try {
        const submissions = await SubmissionsService.getAllSubmissions();
        const acSubmissions = submissions
          .filter(
            (s) =>
              s.status === SubmissionStatus.ACCEPTED &&
              s.problemId === problemId
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt || '').getTime() -
              new Date(a.createdAt || '').getTime()
          );

        if (acSubmissions.length > 0) {
          setAcceptedSubmissionId(acSubmissions[0].id.toString());
        } else {
          setAcceptedSubmissionId(null);
        }
      } catch (error) {
        console.error('Error checking AC status:', error);
      }
    };
    checkACStatus();
  }, [problemId]);

  const selectedSolution = solutions.find((s) => s.id === selectedSolutionId);

  // Resizable logic
  const {
    containerRef,
    leftWidth,
    isHorizontalDragging,
    handleHorizontalMouseDown,
  } = useResizable({
    initialLeftWidth: 40,
    minLeftWidth: 20,
    maxLeftWidth: 80,
  });

  const listStyleWidth = `calc(${leftWidth}% - 6px)`;
  const detailStyleWidth = `calc(${100 - leftWidth}% - 6px)`;

  return (
    <div className="h-full">
      <div
        ref={containerRef}
        className="flex h-full relative bg-slate-50 dark:bg-slate-900"
        style={{ height: 'calc(100vh - 65px)' }}
      >
        {/* Left Panel: List */}
        <div
          style={{ width: listStyleWidth }}
          className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
        >
          <SolutionFilter
            keyword={keyword}
            onKeywordChange={handleKeywordChange}
            onSearch={handleSearch}
            sortBy={sortBy}
            onSortChange={handleSortByChange}
            selectedTags={filters.tagIds || []}
            onTagsChange={(ids) =>
              handleFiltersChange({ ...filters, tagIds: ids })
            }
            selectedLanguages={filters.languageIds || []}
            onLanguagesChange={(ids) =>
              handleFiltersChange({ ...filters, languageIds: ids })
            }
            submissionId={acceptedSubmissionId}
            problemId={problemId}
          />
          <SolutionList
            solutions={solutions}
            selectedId={selectedSolutionId || undefined}
            onSelect={setSelectedSolutionId}
            hasMore={pageInfo?.hasNextPage || false}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </div>

        {/* Divider */}
        <div className="w-1 mx-1 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
          <ResizableDivider
            direction="horizontal"
            isDragging={isHorizontalDragging}
            onMouseDown={handleHorizontalMouseDown}
          />
        </div>

        {/* Right Panel: Detail */}
        <div
          style={{ width: detailStyleWidth }}
          className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
        >
          {selectedSolution ? (
            <SolutionDetailPanel
              solution={selectedSolution}
              onDelete={() => {
                setSelectedSolutionId(null);
                refresh();
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Chọn một solution để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
