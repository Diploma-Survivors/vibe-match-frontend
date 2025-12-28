'use client';

import SubmissionsPage from '@/components/problems/tabs/submissions/submissions-page';
import SubmissionsSkeleton from '@/components/problems/tabs/submissions/submissions-skeleton';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProblemSubmissionsPage() {
  const params = useParams();
  const problemId = params.id as string;

  if (!problemId) {
    return <SubmissionsSkeleton showRightPanel={false} />;
  }

  return <SubmissionsPage problemId={problemId} />;
}
