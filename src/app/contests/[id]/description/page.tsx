'use client';
import Timeline from '@/components/contest/timeline';
import ReadOnlyEditor from '@/components/lexical-editor/lexical-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Đang tải thông tin...
          </p>
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
        {/* Contest Info*/}
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 shadow-xl dark:border-slate-700/50 p-8">
          <div className="text-center mb-6 grid grid-cols-1 gap-2">
            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              {contestOverview.name}
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <Badge
                  className={`${
                    contestStatus !== undefined
                      ? ContestsService.getContestStatusColor(contestStatus)
                      : ''
                  } text-lg px-4 py-2`}
                >
                  {contestStatus !== undefined
                    ? ContestStatusLabels[contestStatus]
                    : 'Đang tải...'}
                </Badge>
              </div>
            </div>

            {/* Timeline */}
            <div className="w-full max-w-2xl mx-auto">
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
                  ...(contestOverview.lateDeadline
                    ? [
                        {
                          id: 'late',
                          name: 'Hạn chót nộp muộn',
                          timestamp: contestOverview.lateDeadline,
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </div>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <div className="text-base text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={contestOverview.description} />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              {/* <p className="font-semibold mb-2">Thông tin:</p> */}
              <div className="space-y-2">
                {/* <p className="pl-4">
                  • Số bài tập: <strong>{contest.problems.length} bài</strong>
                </p> */}
                {/* <p className="pl-4">
                  • Tổng điểm: <strong>{totalScore} điểm</strong>
                </p> */}
                <p className="">
                  <strong>Thời lượng: </strong>

                  {contestOverview.durationMinutes != null
                    ? `${contestOverview.durationMinutes} phút`
                    : 'không giới hạn thời gian'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="">
                  <strong>Quy định nộp bài (áp dụng cho từng problem):</strong>{' '}
                  {
                    CONTEST_SUBMISSION_STRATEGY_DESCRIPTION[
                      contestOverview.submissionStrategy
                    ]
                  }{' '}
                  bài
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
                ? 'Bắt đầu làm'
                : contestStatus === ContestStatus.IN_PROGRESS
                  ? 'Tiếp tục làm bài'
                  : contestStatus === ContestStatus.COMPLETED
                    ? 'Xem kết quả'
                    : 'Không xác định'}
            </Button>
          </div>

          {/* Problems List */}
          {contestOverview.hasParticipated && contestDetail && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Bài tập</h2>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {contestDetail.problems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-800 dark:text-slate-200 font-medium">
                          {problem.title}
                        </h3>
                        {/* <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Thời gian: {problem.timeLimitMs}ms
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Bộ nhớ: {Math.round(problem.memoryLimitKb / 1024)}MB
                        </span>
                      </div> */}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {`${problem.userScore ?? 0}/${problem.maxScore ?? 0} pts`}
                      </span>
                      {/* <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                      điểm
                    </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
