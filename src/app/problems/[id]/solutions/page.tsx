'use client';

import SolutionsSkeleton from '@/components/problems/tabs/solutions/solutions-skeleton';
import SolutionsTab from '@/components/problems/tabs/solutions/solutions-tab';
import { useParams } from 'next/navigation';

export default function ProblemSolutionsPage() {
  const params = useParams();
  const problemId = params.id as string;

  if (!problemId) {
    return <SolutionsSkeleton />;
  }

  return (
    <div className="h-full bg-card">
      <SolutionsTab problemId={problemId} />
    </div>
  );
}
