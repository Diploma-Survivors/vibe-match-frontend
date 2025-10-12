'use client';

import ProblemDescription from '@/components/problems/description-tab/problem-description';
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
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative inline-flex mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 dark:border-r-purple-400 rounded-full animate-spin"
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Đang tải bài toán...
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  return <ProblemDescription problem={problem} showContestInfo={false} />;
}
