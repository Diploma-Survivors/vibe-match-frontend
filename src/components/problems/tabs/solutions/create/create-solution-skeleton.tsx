import { Skeleton } from '@/components/ui/skeleton';

export default function CreateSolutionSkeleton() {
  return (
    <div className="h-[calc(100vh-65px)] bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
      <div className="max-w-screen-2xl mx-auto w-full px-4 flex flex-col h-full">
        {/* Header Skeleton */}
        <div className="h-12 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Skeleton className="h-8 w-1/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        <div className="py-2 space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Tag/Language Selector Skeleton */}
          <div className="flex items-center gap-4 mb-2 px-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Editor Split Pane Skeleton */}
          <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50">
              {/* Change: Use a static array of IDs instead of map index */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                <Skeleton key={id} className="h-8 w-8" />
              ))}
            </div>

            {/* Split Content */}
            <div className="flex-1 flex">
              <div className="w-1/2 h-full p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800" />
              <div className="w-1/2 h-full p-4">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-32 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
