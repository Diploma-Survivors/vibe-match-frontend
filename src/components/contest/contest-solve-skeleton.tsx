import { Skeleton } from '@/components/ui/skeleton';

export default function ContestSolvePageSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 1. Top Bar Skeleton */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 gap-4">
        {/* Left: Contest Name & Nav Buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-32 h-8 rounded bg-slate-200" />{' '}
          {/* Contest Name */}
          <div className="flex items-center gap-1">
            <Skeleton className="w-8 h-8 rounded bg-slate-200" />{' '}
            {/* Prev Button */}
            <Skeleton className="w-8 h-8 rounded bg-slate-200" />{' '}
            {/* Next Button */}
          </div>
        </div>

        {/* Center: Navigation Tabs (Description, Submissions) */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-8 rounded bg-slate-200" />
          <Skeleton className="w-24 h-8 rounded bg-slate-200" />
        </div>

        {/* Right: Timer & End Button */}
        <div className="flex items-center min-w-[250px] gap-4 justify-end">
          <Skeleton className="w-20 h-8 rounded bg-slate-200" /> {/* Timer */}
          <Skeleton className="w-20 h-8 rounded bg-slate-200" />{' '}
          {/* End Contest Button */}
        </div>
      </div>

      {/* 2. Main Content Skeleton (Split Layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description */}
        <div className="w-1/2 h-full border-r border-slate-200 p-6 space-y-4">
          <Skeleton className="w-3/4 h-8 bg-slate-200 mb-4" />{' '}
          {/* Problem Title */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="w-16 h-5 rounded-full bg-slate-200" />{' '}
            {/* Difficulty */}
            <Skeleton className="w-16 h-5 rounded-full bg-slate-200" />{' '}
            {/* Tags */}
          </div>
          {/* Description Paragraphs */}
          <div className="space-y-3">
            <Skeleton className="w-full h-4 bg-slate-200" />
            <Skeleton className="w-full h-4 bg-slate-200" />
            <Skeleton className="w-5/6 h-4 bg-slate-200" />
            <Skeleton className="w-4/5 h-4 bg-slate-200" />
          </div>
          <div className="pt-4 space-y-3">
            <Skeleton className="w-full h-32 rounded bg-slate-200" />{' '}
            {/* Example Box */}
          </div>
        </div>

        {/* Right Panel: Editor & Test Cases */}
        <div className="w-1/2 h-full flex flex-col">
          {/* Editor Header */}
          <div className="h-10 border-b border-slate-200 flex items-center justify-between px-4">
            <Skeleton className="w-32 h-6 bg-slate-200" />{' '}
            {/* Language Select */}
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 bg-slate-200" /> {/* Settings */}
              <Skeleton className="w-8 h-8 bg-slate-200" /> {/* Fullscreen */}
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <Skeleton className="w-40 h-4 bg-slate-200" />
              <Skeleton className="w-56 h-4 bg-slate-200" />
              <Skeleton className="w-32 h-4 bg-slate-200 ml-4" />
              <Skeleton className="w-48 h-4 bg-slate-200 ml-4" />
              <Skeleton className="w-10 h-4 bg-slate-200" />
            </div>
          </div>

          {/* Bottom Action Bar (Run/Submit) */}
          <div className="h-14 border-t border-slate-200 flex items-center justify-between px-4 bg-white">
            <Skeleton className="w-24 h-8 bg-slate-200" /> {/* Testcase Tab */}
            <div className="flex gap-2">
              <Skeleton className="w-20 h-9 rounded bg-slate-200" /> {/* Run */}
              <Skeleton className="w-20 h-9 rounded bg-slate-200" />{' '}
              {/* Submit */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
