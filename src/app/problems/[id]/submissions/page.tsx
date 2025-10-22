'use client';

import { ResizableDivider } from '@/components/problems/tabs/description/dividers/resizable-divider';
import SubmissionDetail from '@/components/problems/tabs/submissions/submission-detail';
import SubmissionsList from '@/components/problems/tabs/submissions/submissions-list';
import { useResizable } from '@/hooks/use-resizable';
import useSubmissions from '@/hooks/use-submissions';
import { SubmissionsService } from '@/services/submissions-service';
import type { SubmissionStatus } from '@/types/submissions';
import { useEffect, useState } from 'react';

export default function ProblemSubmissionsPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const [problemId, setProblemId] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] =
    useState<any>(null);

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
    request,
    handleFiltersChange,
    handleLoadMore,
    handleReset,
  } = useSubmissions(problemId);

  // Effect 1: Resolve params only once
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setProblemId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Effect 2: Auto-select first submission when submissions change
  useEffect(() => {
    if (submissions.length > 0 && !selectedSubmission) {
      handleSelectSubmission(submissions[0].node);
    }
  }, [submissions, selectedSubmission]);

  // Handle submission selection
  const handleSelectSubmission = async (submission: any) => {
    setSelectedSubmission(submission);

    try {
      const response = await SubmissionsService.getSubmissionById(
        submission.id.toString()
      );
      console.log('Submission detail:', response.data.data);
      setSelectedSubmissionDetail(response.data.data);
    } catch (error) {
      console.error('Error fetching submission detail:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    status: string;
    language: string;
  }) => {
    // Convert UI filters to API filters
    const apiFilters: any = {};
    if (newFilters.status !== 'ALL') {
      apiFilters.status = newFilters.status as SubmissionStatus;
    }
    if (newFilters.language !== 'ALL') {
      apiFilters.languageId = Number.parseInt(newFilters.language);
    }

    handleFiltersChange({ filters: apiFilters });
  };

  // Resize logic is now handled by useResizable hook

  if (isLoading && submissions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
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
            onFilterChange={handleFilterChange}
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
          <SubmissionDetail submission={selectedSubmissionDetail} />
        </div>
      </div>
    </div>
  );
}
