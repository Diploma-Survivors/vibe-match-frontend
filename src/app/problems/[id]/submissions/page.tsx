'use client';

import { ResizableDivider } from '@/components/problems/tabs/description/dividers/resizable-divider';
import SubmissionDetail from '@/components/problems/tabs/submissions/submission-detail';
import SubmissionsList from '@/components/problems/tabs/submissions/submissions-list';
import { SubmissionsService } from '@/services/submissions-service';
import { useEffect, useRef, useState } from 'react';

export default function ProblemSubmissionsPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const [problemId, setProblemId] = useState<string>('');
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] =
    useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'ALL', language: 'ALL' });

  // Resize state
  const [leftWidth, setLeftWidth] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect 1: Resolve params only once
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setProblemId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Effect 2: Fetch submissions when problemId changes
  useEffect(() => {
    if (!problemId) return;

    async function fetchSubmissions() {
      setIsLoading(true);
      try {
        const submissionListRequest = {
          first: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          matchMode: 'any',
        };

        const response = await SubmissionsService.getSubmissionList(
          submissionListRequest,
          problemId
        );
        const submissionsData = response.data.data.edges;

        console.log('Submissions:', submissionsData);
        setSubmissions(submissionsData);

        // Auto-select first submission if available
        if (submissionsData.length > 0) {
          handleSelectSubmission(submissionsData[0].node);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubmissions();
  }, [problemId]);

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
    setFilters(newFilters);
    // TODO: Implement filtering logic
    console.log('Filters changed:', newFilters);
  };

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 80%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading submissions...</p>
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
          />
        </div>

        {/* Horizontal Resizer - Centered between panels */}
        <div className="w-1 mx-1 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded">
          <ResizableDivider
            direction="horizontal"
            isDragging={isDragging}
            onMouseDown={handleMouseDown}
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
