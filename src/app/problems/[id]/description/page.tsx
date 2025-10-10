'use client';

import ProblemDetailComponent from '@/components/problem/problem-detail-tab';
import { ProblemsService } from '@/services/problems-service';
import type { ProblemDetail as ProblemDetailType } from '@/types/problems';

import { useEffect, useState } from 'react';

export default function ProblemDescriptionPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const [problemId, setProblemId] = useState<string | null>(null);
  const [problem, setProblem] = useState<ProblemDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect 1: Resolve params only once
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setProblemId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Effect 2: Fetch problem when problemId changes
  useEffect(() => {
    if (!problemId) return;

    async function fetchProblem(id: string) {
      setIsLoading(true);
      try {
        const axiosResponse = await ProblemsService.getProblemById(id);

        setProblem(axiosResponse);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProblem(problemId);
  }, [problemId]);

  if (isLoading || !problem) {
    return <div>Loading...</div>;
  }

  return <ProblemDetailComponent problem={problem} showContestInfo={false} />;
}
