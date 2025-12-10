'use client';

import ProblemDescription from '@/components/problems/tabs/description/problem-description';
import { ProblemsService } from '@/services/problems-service';
import type { ProblemDescription as ProblemDetailType } from '@/types/problems';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
        <div className="h-full">
          <div
            className="flex h-full gap-0 relative bg-slate-50 dark:bg-slate-900"
            style={{ height: 'calc(100vh - 60px)' }}
          >
            {/* Left Panel Skeleton - Problem Description */}
            <div
              className="overflow-y-auto h-full pb-4"
              style={{ width: '50%' }}
            >
              <div className="">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div className="p-8 space-y-8">
                    {/* Problem Title Header Skeleton */}
                    <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                      <Skeleton height={32} width="75%" className="mb-4" />
                      <div className="flex items-center gap-4 flex-wrap">
                        <Skeleton height={24} width={80} borderRadius={12} />
                        <Skeleton height={16} width={96} />
                        <Skeleton height={16} width={80} />
                        <Skeleton height={16} width={64} />
                      </div>
                    </div>

                    {/* Problem Description Skeleton */}
                    <section>
                      <Skeleton height={24} width={128} className="mb-4" />
                      <div className="space-y-3">
                        <Skeleton height={16} width="100%" />
                        <Skeleton height={16} width="83%" />
                        <Skeleton height={16} width="80%" />
                        <Skeleton height={16} width="75%" />
                      </div>
                    </section>

                    {/* Input Format Skeleton */}
                    <section>
                      <Skeleton height={24} width={80} className="mb-4" />
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="space-y-2">
                          <Skeleton height={16} width="100%" />
                          <Skeleton height={16} width="75%" />
                          <Skeleton height={16} width="83%" />
                        </div>
                      </div>
                    </section>

                    {/* Output Format Skeleton */}
                    <section>
                      <Skeleton height={24} width={64} className="mb-4" />
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="space-y-2">
                          <Skeleton height={16} width="100%" />
                          <Skeleton height={16} width="67%" />
                        </div>
                      </div>
                    </section>

                    {/* Constraints Skeleton */}
                    <section>
                      <Skeleton height={24} width={96} className="mb-4" />
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="space-y-2">
                          <Skeleton height={16} width={128} />
                          <Skeleton height={16} width={112} />
                        </div>
                      </div>
                    </section>

                    {/* Sample Cases Skeleton */}
                    <section>
                      <Skeleton height={24} width={64} className="mb-4" />

                      {/* Case selector tabs skeleton */}
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton height={32} width={64} borderRadius={8} />
                        <Skeleton height={32} width={64} borderRadius={8} />
                      </div>

                      {/* Sample content skeleton */}
                      <div className="space-y-4">
                        <div>
                          <Skeleton height={16} width={48} className="mb-2" />
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                            <Skeleton height={16} width="75%" />
                          </div>
                        </div>
                        <div>
                          <Skeleton height={16} width={64} className="mb-2" />
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                            <Skeleton height={16} width="67%" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Resizer Skeleton */}
            <div className="w-1 bg-slate-200 dark:bg-slate-700" />

            {/* Right Panel Skeleton - Editor and Test Cases */}
            <div
              className="flex flex-col overflow-hidden pb-4"
              style={{ width: '50%' }}
            >
              <div className="flex flex-col h-full gap-0">
                {/* Editor Section Skeleton */}
                <div
                  className="flex flex-col overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  style={{ height: '50%' }}
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton height={16} width={64} />
                      <div className="flex gap-2">
                        <Skeleton height={32} width={64} borderRadius={6} />
                        <Skeleton height={32} width={80} borderRadius={6} />
                      </div>
                    </div>
                    <Skeleton height={24} width={96} />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-2">
                      <Skeleton height={16} width="100%" />
                      <Skeleton height={16} width="83%" />
                      <Skeleton height={16} width="80%" />
                      <Skeleton height={16} width="75%" />
                      <Skeleton height={16} width="83%" />
                    </div>
                  </div>
                </div>

                {/* Vertical Resizer Skeleton */}
                <div className="h-1 bg-slate-200 dark:bg-slate-700" />

                {/* Test Cases Section Skeleton */}
                <div
                  className="flex flex-col overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  style={{ height: '50%' }}
                >
                  <div className="px-6 pt-4">
                    <div className="inline-flex items-center gap-2 rounded-xl p-1 bg-slate-100/70 dark:bg-slate-700/40">
                      <Skeleton height={32} width={80} borderRadius={8} />
                      <Skeleton height={32} width={96} borderRadius={8} />
                    </div>
                  </div>

                  <div className="p-6 pt-4 flex-1">
                    {/* Case Tabs Skeleton */}
                    <div className="flex items-center gap-2 mb-6">
                      <Skeleton height={32} width={64} borderRadius={8} />
                      <Skeleton height={32} width={64} borderRadius={8} />
                      <Skeleton height={32} width={48} borderRadius={8} />
                    </div>

                    {/* Test Case Content Skeleton */}
                    <div className="space-y-6">
                      <div>
                        <Skeleton height={16} width={48} className="mb-3" />
                        <Skeleton height={80} width="100%" borderRadius={8} />
                      </div>
                      <div>
                        <Skeleton height={16} width={80} className="mb-3" />
                        <Skeleton height={80} width="100%" borderRadius={8} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return <ProblemDescription problem={problem} />;
}
