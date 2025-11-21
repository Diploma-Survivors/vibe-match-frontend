'use client';

import { ResizableDivider } from '@/components/problems/tabs/description/dividers/resizable-divider';
import SubmissionDetail from '@/components/problems/tabs/submissions/submission-detail';
import SubmissionsList from '@/components/problems/tabs/submissions/submissions-list';
import SubmissionsSkeleton from '@/components/problems/tabs/submissions/submissions-skeleton';
import { useResizable } from '@/hooks/use-resizable';
import useSubmissions from '@/hooks/use-submissions';
import { SubmissionsService } from '@/services/submissions-service';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  // Use resizable hook
  const {
    containerRef,
    leftWidth,
    isHorizontalDragging,
    handleHorizontalMouseDown,
  } = useResizable({
    initialLeftWidth: 50,
    minLeftWidth: 20,
    maxLeftWidth: 80,
  });

  // Use submissions hook
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

  // Handle submission selection
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
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div
        ref={containerRef}
        className="flex h-full relative bg-slate-50 dark:bg-slate-900"
        style={{
          height: 'calc(100vh - 60px)',
        }}
      >
        {/* Left Panel - Submissions List */}
        <div style={{ width: `calc(${leftWidth}% - 6px)` }}>
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

        {/* Horizontal Resizer - Centered between panels */}
        <div className="w-1 mx-1 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded">
          <ResizableDivider
            direction="horizontal"
            isDragging={isHorizontalDragging}
            onMouseDown={handleHorizontalMouseDown}
          />
        </div>

        {/* Right Panel - Submission Detail */}
        <div style={{ width: `calc(${100 - leftWidth}% - 6px)` }}>
          {isLoadingForSubmissionDetail ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            </div>
          ) : (
            <SubmissionDetail submission={selectedSubmissionDetail} />
          )}
        </div>
      </div>
    </div>
  );
}
