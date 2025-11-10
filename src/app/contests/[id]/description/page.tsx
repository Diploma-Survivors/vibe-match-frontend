'use client';
import Timeline from '@/components/contest/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import {
  CONTEST_STATUS_COLORS,
  type Contest,
  ContestStatus,
  ContestStatusLabels,
} from '@/types/contests';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function ContestInfoPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [contestStatus, setContestStatus] = useState<ContestStatus>();

  const fetchContestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestById(contestId);
      setContest(response.data.data);
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestData();
  }, [fetchContestData]);

  useEffect(() => {
    if (contest) {
      setContestStatus(ContestsService.getContestStatus(contest));
    }
  }, [contest]);

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

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Không tìm thấy
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Cuộc thi này không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  const totalScore = contest.problems.reduce((sum, p) => sum + p.score, 0);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
        {/* Contest Info*/}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
          <div className="text-center mb-6 grid grid-cols-1 gap-2">
            <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              {contest.name}
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <Badge
                  className={`${
                    contestStatus === ContestStatus.NOT_STARTED
                      ? CONTEST_STATUS_COLORS.upcoming
                      : contestStatus === ContestStatus.ONGOING
                        ? CONTEST_STATUS_COLORS.ongoing
                        : contestStatus === ContestStatus.IN_PROGRESS
                          ? CONTEST_STATUS_COLORS.ongoing
                          : contestStatus === ContestStatus.COMPLETED
                            ? CONTEST_STATUS_COLORS.finished
                            : contestStatus === ContestStatus.FINISHED
                              ? CONTEST_STATUS_COLORS.finished
                              : CONTEST_STATUS_COLORS.finished
                  } text-lg px-4 py-2`}
                >
                  {contestStatus === ContestStatus.NOT_STARTED
                    ? ContestStatusLabels[ContestStatus.NOT_STARTED]
                    : contestStatus === ContestStatus.ONGOING
                      ? ContestStatusLabels[ContestStatus.ONGOING]
                      : contestStatus === ContestStatus.IN_PROGRESS
                        ? ContestStatusLabels[ContestStatus.IN_PROGRESS]
                        : contestStatus === ContestStatus.COMPLETED
                          ? ContestStatusLabels[ContestStatus.COMPLETED]
                          : contestStatus === ContestStatus.FINISHED
                            ? ContestStatusLabels[ContestStatus.FINISHED]
                            : ContestStatusLabels[ContestStatus.FINISHED]}
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
                    timestamp: contest.startTime,
                  },
                  { id: 'end', name: 'Kết thúc', timestamp: contest.endTime },
                  ...(contest.lateDeadline
                    ? [
                        {
                          id: 'late',
                          name: 'Hạn chót nộp muộn',
                          timestamp: contest.lateDeadline,
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </div>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p className="text-base">{contest.description}</p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="font-semibold mb-2">Thông tin cuộc thi:</p>
              <div className="space-y-2">
                <p className="pl-4">
                  • Số bài tập: <strong>{contest.problems.length} bài</strong>
                </p>
                <p className="pl-4">
                  • Tổng điểm: <strong>{totalScore} điểm</strong>
                </p>
                <p className="pl-4">
                  • Thời lượng:{' '}
                  <strong>
                    {contest.durationMinutes != null
                      ? `${contest.durationMinutes} phút`
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
            >
              {contestStatus === ContestStatus.ONGOING
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
