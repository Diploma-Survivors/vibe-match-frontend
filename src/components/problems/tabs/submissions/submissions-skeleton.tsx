'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SubmissionsSkeletonProps {
  showRightPanel?: boolean;
}

export default function SubmissionsSkeleton({
  showRightPanel = false,
}: SubmissionsSkeletonProps) {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="h-screen">
        <div
          className="flex h-full relative bg-slate-50 dark:bg-slate-900"
          style={{ height: 'calc(100vh - 60px)' }}
        >
          {/* Left Panel - Submissions Skeleton */}
          <div style={{ width: showRightPanel ? 'calc(50% - 6px)' : '100%' }}>
            <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden pl-2">
              {/* Filter Skeleton */}
              <div className="p-3 border-b bg-gray-50">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Skeleton height={32} />
                  </div>
                  <div className="flex-1">
                    <Skeleton height={32} />
                  </div>
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="space-y-4">
                  {/* Table Header Skeleton */}
                  <div className="bg-white border-b border-gray-200 sticky top-0 z-10 text-xs">
                    <div className="flex px-4 py-3">
                      <div className="w-1/4">
                        <Skeleton height={16} width={60} />
                      </div>
                      <div className="w-1/4">
                        <Skeleton height={16} width={80} />
                      </div>
                      <div className="w-1/4">
                        <Skeleton height={16} width={70} />
                      </div>
                      <div className="w-1/4">
                        <Skeleton height={16} width={70} />
                      </div>
                    </div>
                  </div>

                  {/* Table Rows Skeleton */}
                  {Array.from([1, 2, 3, 4, 5, 6, 7, 8]).map((val) => (
                    <div
                      key={val}
                      className="bg-white border-b border-gray-200"
                    >
                      <div className="flex px-4 py-3">
                        {/* Status Column */}
                        <div className="w-1/4 flex items-center gap-3">
                          <Skeleton circle height={20} width={20} />
                          <Skeleton height={14} width={80} />
                        </div>

                        {/* Language Column */}
                        <div className="w-1/4">
                          <Skeleton height={14} width={60} />
                        </div>

                        {/* Runtime Column */}
                        <div className="w-1/4 flex items-center gap-1">
                          <Skeleton height={16} width={16} />
                          <Skeleton height={14} width={50} />
                        </div>

                        {/* Memory Column */}
                        <div className="w-1/4 flex items-center gap-1">
                          <Skeleton height={16} width={16} />
                          <Skeleton height={14} width={50} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel Skeleton */}
          {showRightPanel && (
            <>
              {/* Horizontal Resizer */}
              <div className="w-1 mx-1 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded" />

              {/* Right Panel - Submission Detail Skeleton */}
              <div style={{ width: 'calc(50% - 6px)' }}>
                <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Header Skeleton */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton height={24} width={120} />
                      <Skeleton height={32} width={80} />
                    </div>
                    <div className="space-y-2">
                      <Skeleton height={16} width={200} />
                      <Skeleton height={16} width={150} />
                    </div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-8 space-y-7">
                    {/* Status Card */}
                    <div className="p-5 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Skeleton circle height={20} width={20} />
                        <Skeleton height={18} width={140} />
                      </div>
                      <Skeleton height={14} width={180} className="mt-2" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-gray-200 p-5">
                        <Skeleton height={12} width={60} className="mb-2" />
                        <Skeleton height={20} width={90} />
                      </div>
                      <div className="rounded-lg border border-gray-200 p-5">
                        <Skeleton height={12} width={70} className="mb-2" />
                        <Skeleton height={20} width={80} />
                      </div>
                      <div className="rounded-lg border border-gray-200 p-5">
                        <Skeleton height={12} width={70} className="mb-2" />
                        <Skeleton height={20} width={80} />
                      </div>
                    </div>

                    {/* Source Code */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton height={20} width={110} />
                        <Skeleton height={32} width={70} />
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <div className="p-4">
                          <div className="space-y-2">
                            {Array.from([
                              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                            ]).map((val) => {
                              const widths = [
                                95, 88, 92, 85, 90, 87, 93, 89, 86, 91, 88, 94,
                              ];
                              return (
                                <Skeleton
                                  key={val}
                                  height={16}
                                  width={`${widths[val % widths.length]}%`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}
