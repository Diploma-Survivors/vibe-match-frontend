'use client';

import SolutionsSkeleton from '@/components/problems/tabs/solutions/solutions-skeleton';
import SolutionsTab from '@/components/problems/tabs/solutions/solutions-tab';
import { use, useEffect, useState } from 'react';

export default function ProblemSolutionsPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const [problemId, setProblemId] = useState<string>('');

  // Effect: Resolve params only once
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setProblemId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  if (!problemId) {
    return <SolutionsSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-65px)]">
      <SolutionsTab problemId={problemId} />
    </div>
  );
}
