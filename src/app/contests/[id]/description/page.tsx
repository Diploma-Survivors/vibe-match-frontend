'use client';
import Timeline from '@/components/contest/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import {
  type Contest,
  type ContestOverView,
  ContestStatus,
  ContestStatusLabels,
} from '@/types/contests';
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

  const fetchContestDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestDetail(contestId);
      setContestDetail(response.data.data);
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  const fetchContestOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestOverview(contestId);
      const contestOverview: ContestOverView = response?.data?.data;
      console.log(contestOverview.hasParticipated);
      if (contestOverview.hasParticipated) {
        fetchContestDetail();
      }
      setContestOverview(contestOverview);
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
      await ContestsService.participateContest(contestId);
      router.push(`/contests/${contestId}/solve`);
    } catch (error) {
      console.error('Error starting contest:', error);
    }
  }, [contestId, router]);

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
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
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
            <p className="text-base">{contestOverview.description}</p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              {/* <p className="font-semibold mb-2">Thông tin:</p> */}
              <div className="space-y-2">
                {/* <p className="pl-4">
                  • Số bài tập: <strong>{contest.problems.length} bài</strong>
                </p> */}
                {/* <p className="pl-4">
                  • Tổng điểm: <strong>{totalScore} điểm</strong>
                </p> */}
                <p className="pl-4">
                  Thời lượng:{' '}
                  <strong>
                    {contestOverview.durationMinutes != null
                      ? `${contestOverview.durationMinutes} phút`
                      : 'không giới hạn thời gian'}
                  </strong>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md mx-auto mt-6">
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
        </div>
      </div>
    </div>
  );
}
