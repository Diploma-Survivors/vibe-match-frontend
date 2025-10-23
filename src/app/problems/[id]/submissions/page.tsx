'use client';

import SubmissionsPage from '@/components/problems/tabs/submissions/submissions-page';
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
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <SubmissionsPage problemId={problemId} />;
}
