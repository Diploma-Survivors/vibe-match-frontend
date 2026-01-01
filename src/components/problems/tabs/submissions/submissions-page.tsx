'use client';

import SubmissionsList from '@/components/problems/tabs/submissions/submissions-list';
import SubmissionsSkeleton from '@/components/problems/tabs/submissions/submissions-skeleton';
import useSubmissions from '@/hooks/use-submissions';
import { usePathname, useRouter } from 'next/navigation';

interface SubmissionsPageProps {
  problemId: string;
  contestParticipationId?: number;
}

export default function SubmissionsPage({
  problemId,
  contestParticipationId,
}: SubmissionsPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Data fetching hook
  const {
    submissions,
    totalCount,
    isLoading,
    error,
    filters,
    handleFiltersChange,
    handleLoadMore,
  } = useSubmissions(problemId, contestParticipationId);

  const handleSelectSubmission = (submission: any) => {
    router.push(`${pathname}/${submission.id}`);
  };

  if (isLoading && submissions.length === 0) {
    return <SubmissionsSkeleton showRightPanel={false} />;
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-card">
      <SubmissionsList
        submissions={submissions}
        selectedSubmissionId={null}
        onSelectSubmission={(s) => handleSelectSubmission(s)}
        filters={filters}
        onFilterChange={handleFiltersChange}
        hasMore={false}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        totalCount={totalCount}
      />
    </div>
  );
}
