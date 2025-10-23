'use client';

import SubmissionsPage from '@/components/problems/tabs/submissions/submissions-page';
import SubmissionsSkeleton from '@/components/problems/tabs/submissions/submissions-skeleton';
import { useEffect, useState } from 'react';

export default function ProblemSubmissionsPage({
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
    return <SubmissionsSkeleton showRightPanel={true} />;
  }

  return <SubmissionsPage problemId={problemId} />;
}
