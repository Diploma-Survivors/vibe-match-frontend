'use client';

import Timeline from '@/components/contest/timeline';
import ReadOnlyEditor from '@/components/lexical-editor/lexical-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ContestsService } from '@/services/contests-service';
import {
  CONTEST_SUBMISSION_STRATEGY_DESCRIPTION,
  type Contest,
  type ContestOverView,
  ContestStatus,
  ContestStatusLabels,
} from '@/types/contests';
import { FileText } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function ContestInfoPage() {
  const params = useParams();
  const contestId = params.id as string;
  const router = useRouter();

  const [contestDetail, setContestDetail] = useState<Contest | null>(null);
  const [contestOverview, setContestOverview] = useState<ContestOverView>();
  const [loading, setLoading] = useState(true);
  const [contestStatus, setContestStatus] = useState<ContestStatus>();

  const fetchContestDetail = useCallback(
    async (contestOverview: ContestOverView) => {
      try {
        const response = await ContestsService.getContestDetail(contestId);
        setContestOverview(contestOverview);
        setContestDetail(response.data.data);
      } catch (error) {
        console.error('Error fetching contest:', error);
      }
    },
    [contestId]
  );

  const fetchContestOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestOverview(contestId);
      const contestOverview: ContestOverView = response?.data?.data;
      if (contestOverview.hasParticipated) {
        await fetchContestDetail(contestOverview);
      } else {
        setContestOverview(contestOverview);
      }
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId, fetchContestDetail]);

  useEffect(() => {
    fetchContestOverview();
  }, [fetchContestOverview]);

  useEffect(() => {
    if (contestDetail) {
      setContestStatus(ContestsService.getContestStatus(contestDetail));
    } else if (contestOverview) {
      setContestStatus(
        ContestsService.getContestStatus(contestOverview as unknown as Contest)
      );
    }
  }, [contestDetail, contestOverview]);

  const start = useCallback(async () => {
    try {
      if (
        contestStatus === ContestStatus.ONGOING ||
        contestStatus === ContestStatus.LATE_SUBMISSION
      ) {
        await ContestsService.participateContest(contestId);
      }
      router.push(`/contests/${contestId}/solve`);
    } catch (error) {
      console.error('Error starting contest:', error);
    }
  }, [contestId, router, contestStatus]);

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 shadow-xl dark:border-slate-700/50 p-8">
            <div className="text-center mb-6 grid grid-cols-1 gap-6">
              {/* Title Skeleton */}
              <Skeleton className="h-10 w-3/4 mx-auto bg-slate-200 dark:bg-slate-700" />

              {/* Badge Skeleton */}
              <div className="flex justify-center">
                <Skeleton className="h-8 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Timeline Skeleton simulation */}
              <div className="w-full max-w-2xl mx-auto py-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-1 w-full mx-2" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Description Skeletons */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>

              {/* Footer Info Skeletons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="w-full max-w-md mx-auto mt-6 mb-6">
              <Skeleton className="h-10 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Problems List Skeleton (Optional visual) */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden mt-8">
              <div className="bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="w-8 h-8 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/3" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contestOverview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Không tìm thấy
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
        {/* Contest Info*/}
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 shadow-xl dark:border-slate-700/50 p-8">
          <div className="text-center mb-6 grid grid-cols-1 gap-2">
            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              {contestOverview.name}
            </h2>
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className={`${
                  contestStatus !== undefined
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : ''
                } text-sm px-4 py-1 rounded-full font-medium flex items-center gap-2`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {contestStatus !== undefined
                  ? ContestStatusLabels[contestStatus]
                  : 'Đang tải...'}
              </Badge>
            </div>

            {/* Timeline */}
            <div className="w-full max-w-3xl mx-auto mt-8">
              <Timeline
                timelineEvents={[
                  {
                    id: 'start',
                    name: 'Bắt đầu',
                    timestamp: contestOverview.startTime,
                  },
                  {
                    id: 'end',
                    name: 'Kết thúc',
                    timestamp: contestOverview.endTime,
                  },
                ]}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
              Thông tin cuộc thi
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <div className="text-base">
                <ReadOnlyEditor value={contestOverview.description} />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-emerald-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">
                    Thời dzfszf lượng:{' '}
                  </strong>
                  {contestOverview.durationMinutes != null
                    ? `${contestOverview.durationMinutes} phút`
                    : 'không giới hạn thời gian'}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-emerald-500"
                  >
                    <line x1="10" x2="21" y1="6" y2="6" />
                    <line x1="10" x2="21" y1="12" y2="12" />
                    <line x1="10" x2="21" y1="18" y2="18" />
                    <path d="M4 6h1v4" />
                    <path d="M4 10h2" />
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                  </svg>
                </div>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">
                    Quy định nộp bài:{' '}
                  </strong>
                  <span className="text-slate-600 dark:text-slate-400">
                    (áp dụng cho từng problem):{' '}
                    {
                      CONTEST_SUBMISSION_STRATEGY_DESCRIPTION[
                        contestOverview.submissionStrategy
                      ]
                    }{' '}
                    bài
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="w-full max-w-md mx-auto mt-6 mb-6">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              hidden={
                contestStatus === ContestStatus.NOT_STARTED ||
                contestStatus === ContestStatus.FINISHED
              }
              onClick={start}
            >
              {contestStatus === ContestStatus.ONGOING ||
              contestStatus === ContestStatus.LATE_SUBMISSION
                ? 'Bắt đầu làm bài'
                : contestStatus === ContestStatus.IN_PROGRESS
                  ? 'Tiếp tục làm bài'
                  : contestStatus === ContestStatus.COMPLETED
                    ? 'Xem kết quả'
                    : 'Không xác định'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 w-5 h-5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-8" />

          {/* Problems List */}
          {contestOverview.hasParticipated && contestDetail && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Bài tập
                </h2>
              </div>

              <div className="space-y-4">
                {contestDetail.problems.map((problem, index) => {
                  const score = problem.userScore ?? 0;
                  const maxScore = problem.maxScore ?? 0;
                  const isFullScore = score === maxScore;

                  return (
                    <div
                      key={problem.id}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                          <span className="text-base font-medium text-slate-600 dark:text-slate-400">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-slate-800 dark:text-slate-200 font-medium text-base">
                            {problem.title}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={`${
                            isFullScore
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          } font-medium text-sm px-3 py-1`}
                        >
                          {`${score}/${maxScore} pts`}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
