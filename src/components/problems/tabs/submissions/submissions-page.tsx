'use client';

import { ResizableDivider } from '@/components/problems/tabs/description/dividers/resizable-divider';
import SubmissionDetail from '@/components/problems/tabs/submissions/submission-detail';
import SubmissionsList from '@/components/problems/tabs/submissions/submissions-list';
import SubmissionsSkeleton from '@/components/problems/tabs/submissions/submissions-skeleton';
import { useResizable } from '@/hooks/use-resizable';
import useSubmissions from '@/hooks/use-submissions';
import { SubmissionsService } from '@/services/submissions-service';
import type { RootState } from '@/store';
import { Loader2 } from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AIReviewPanel from './ai-review-panel';

interface SubmissionsPageProps {
  problemId: string;
  contestParticipationId?: number;
}

export default function SubmissionsPage({
  problemId,
  contestParticipationId,
}: SubmissionsPageProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] =
    useState<any>(null);
  const [isLoadingForSubmissionDetail, setIsLoadingForSubmissionDetail] =
    useState(false);

  const { isVisible: isAIReviewVisible } = useSelector(
    (state: RootState) => state.aiReview
  );

  // ---------------------------------------------------------------------------
  // RESIZER 1: Outer Split (List vs. The Rest)
  // ---------------------------------------------------------------------------
  const {
    containerRef: outerContainerRef,
    leftWidth: listWidth,
    setLeftWidth: setListWidth,
    isHorizontalDragging: isListDragging,
    handleHorizontalMouseDown: handleListResizeStart,
  } = useResizable({
    initialLeftWidth: 50, // List takes 30% of screen
    minLeftWidth: 15,
    maxLeftWidth: 80,
  });

  // ---------------------------------------------------------------------------
  // RESIZER 2: Inner Split (Detail vs. AI)
  // This lives inside the right panel of the first split
  // ---------------------------------------------------------------------------
  const {
    containerRef: innerContainerRef,
    leftWidth: detailWidth, // Relative to the right container
    setLeftWidth: setDetailWidth,
    isHorizontalDragging: isDetailDragging,
    handleHorizontalMouseDown: handleDetailResizeStart,
  } = useResizable({
    initialLeftWidth: 50, // Detail takes 60% of the remaining space
    minLeftWidth: 20,
    maxLeftWidth: 80,
  });

  useLayoutEffect(() => {
    if (isAIReviewVisible) {
      // MODE: 3 Columns (List | Detail | AI)
      // 1. Set List to 1/3 of the screen
      setListWidth(33.33);

      // 2. Set Detail to 1/2 of the REMAINING space.
      // (The remaining space is 66.6%. Half of that is 33.3%, making all 3 equal)
      setDetailWidth(50);
    } else {
      // MODE: 2 Columns (List | Detail)
      // 1. Set List to 1/2 of the screen
      setListWidth(50);

      // (Inner width doesn't matter here as the AI panel is hidden,
      // but resetting it ensures a clean state next time it opens)
      setDetailWidth(50);
    }
  }, [isAIReviewVisible, setListWidth, setDetailWidth]);

  // Data fetching hook
  const {
    submissions,
    pageInfo,
    totalCount,
    isLoading,
    error,
    filters,
    handleFiltersChange,
    handleLoadMore,
  } = useSubmissions(problemId, contestParticipationId);

  // Effect: Auto-select first submission when submissions change
  useEffect(() => {
    if (submissions.length > 0 && !selectedSubmission) {
      handleSelectSubmission(submissions[0].node);
    }
  }, [submissions, selectedSubmission]);

  const handleSelectSubmission = async (submission: any) => {
    setSelectedSubmission(submission);
    setSelectedSubmissionDetail(null);
    setIsLoadingForSubmissionDetail(true);

    try {
      const response = await SubmissionsService.getSubmissionById(
        submission.id.toString()
      );
      setSelectedSubmissionDetail(response.data.data);
    } catch (error) {
      console.error('Error fetching submission detail:', error);
    } finally {
      setIsLoadingForSubmissionDetail(false);
    }
  };

  if (isLoading && submissions.length === 0) {
    return <SubmissionsSkeleton showRightPanel={true} />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Helper to calculate width accounting for divider margins
  // 6px = divider width (4px) + margins (1px + 1px)
  const listStyleWidth = `calc(${listWidth}% - 6px)`;
  const rightContainerWidth = `calc(${100 - listWidth}% - 6px)`;

  return (
    <div className="h-full">
      {/* OUTER CONTAINER */}
      <div
        ref={outerContainerRef}
        className="flex h-full relative bg-slate-50 dark:bg-slate-900"
        style={{ height: 'calc(100vh - 65px)' }}
      >
        {/* PANEL 1: Submissions List */}
        <div
          style={{ width: listStyleWidth }}
          className="h-full transition-all duration-300 ease-in-out"
        >
          <SubmissionsList
            submissions={submissions}
            selectedSubmissionId={selectedSubmission?.id || null}
            onSelectSubmission={handleSelectSubmission}
            filters={filters}
            onFilterChange={handleFiltersChange}
            hasMore={pageInfo?.hasNextPage ?? false}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            totalCount={totalCount}
          />
        </div>

        {/* DIVIDER 1 */}
        <div className="w-1 mx-1 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
          <ResizableDivider
            direction="horizontal"
            isDragging={isListDragging}
            onMouseDown={handleListResizeStart}
          />
        </div>

        {/* RIGHT CONTAINER (Contains Detail + AI) */}
        <div
          ref={innerContainerRef}
          style={{ width: rightContainerWidth }}
          className="h-full flex relative"
        >
          {/* PANEL 2: Submission Detail */}
          {/* If AI is visible, use resize width. If not, take full width. */}
          <div
            style={{
              width: isAIReviewVisible ? `calc(${detailWidth}% - 6px)` : '100%',
            }}
            className="h-full transition-all duration-300"
          >
            {isLoadingForSubmissionDetail ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              </div>
            ) : (
              <SubmissionDetail submission={selectedSubmissionDetail} />
            )}
          </div>

          {/* DIVIDER 2 & PANEL 3 (Conditional) */}
          {isAIReviewVisible && (
            <>
              {/* DIVIDER 2 */}
              <div className="w-1 mx-1 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                <ResizableDivider
                  direction="horizontal"
                  isDragging={isDetailDragging}
                  onMouseDown={handleDetailResizeStart}
                />
              </div>

              {/* PANEL 3: AI Review */}
              <div
                style={{ width: `calc(${100 - detailWidth}% - 6px)` }}
                className="h-full animate-in slide-in-from-right-10 fade-in duration-300"
              >
                {selectedSubmissionDetail && (
                  <AIReviewPanel
                    submissionId={selectedSubmissionDetail.id.toString()}
                    sourceCode={selectedSubmissionDetail.sourceCode}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
