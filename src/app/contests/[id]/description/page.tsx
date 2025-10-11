'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import {
  CONTEST_STATUS_COLORS,
  CONTEST_STATUS_LABELS,
  type ContestDetail,
} from '@/types/contests';
import { Calendar, Clock, FileText, Globe, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function ContestInfoPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestById(contestId);
      setContest(response?.data?.data);
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestData();
  }, [fetchContestData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Đang tải thông tin cuộc thi...
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
            Không tìm thấy cuộc thi
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Cuộc thi này không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);
  const isUpcoming = now < startTime;
  const isOngoing = now >= startTime && now <= endTime;
  const isFinished = now > endTime;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalScore = contest.problems.reduce((sum, p) => sum + p.score, 0);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Contest Header */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
              <div className="flex items-start justify-between">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {contest.name}
                </h1>
              </div>
            </div>

            {/* Contest Status & Description */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                  {isFinished
                    ? 'Kỳ thi đã kết thúc.'
                    : isOngoing
                      ? 'Kỳ thi đang diễn ra.'
                      : 'Kỳ thi sắp diễn ra.'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {isFinished
                    ? `Kết thúc vào ${formatDate(endTime)}, ${formatTime(endTime)}`
                    : isOngoing
                      ? `Đang diễn ra đến ${formatDate(endTime)}, ${formatTime(endTime)}`
                      : `Bắt đầu vào ${formatDate(startTime)}, ${formatTime(startTime)}`}
                </p>
              </div>

              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p className="text-base">{contest.description}</p>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-semibold mb-2">Thông tin cuộc thi:</p>
                  <div className="space-y-2">
                    <p className="pl-4">
                      • Số bài tập:{' '}
                      <strong>{contest.problems.length} bài</strong>
                    </p>
                    <p className="pl-4">
                      • Tổng điểm: <strong>{totalScore} điểm</strong>
                    </p>
                    <p className="pl-4">
                      • Thời lượng:{' '}
                      <strong>{contest.durationMinutes} phút</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
              <div className="bg-slate-800 dark:bg-slate-900 text-white p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Bài tập</h2>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {contest.problems.map((problem, index) => (
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
                        <Link
                          href={`/problems/${problem.id}`}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                        >
                          {problem.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Thời gian: {problem.timeLimitMs}ms
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Bộ nhớ: {Math.round(problem.memoryLimitKb / 1024)}MB
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {problem.score}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        điểm
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Tổng cộng <strong>{contest.problems.length}</strong> bài tập
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Contest Status */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Trạng thái cuộc thi
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge
                    className={`${
                      isUpcoming
                        ? CONTEST_STATUS_COLORS.upcoming
                        : isOngoing
                          ? CONTEST_STATUS_COLORS.ongoing
                          : CONTEST_STATUS_COLORS.finished
                    } text-lg px-4 py-2`}
                  >
                    {isUpcoming
                      ? CONTEST_STATUS_LABELS.upcoming
                      : isOngoing
                        ? CONTEST_STATUS_LABELS.ongoing
                        : CONTEST_STATUS_LABELS.finished}
                  </Badge>
                </div>
                <Button
                  className={`w-full ${
                    isUpcoming
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : isOngoing
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-slate-600 hover:bg-slate-700'
                  }`}
                  disabled={isFinished}
                >
                  {isUpcoming
                    ? 'Đăng ký tham gia'
                    : isOngoing
                      ? 'Vào thi ngay'
                      : 'Xem kết quả'}
                </Button>
              </div>
            </div>

            {/* Contest Info Cards */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-200">
                Thông tin cuộc thi
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ngày thi
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {formatDate(startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Giờ bắt đầu
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {formatTime(startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thời lượng
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {contest.durationMinutes} phút
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Số bài tập
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {contest.problems.length} bài
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-200">
                Thống kê nhanh
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Số bài tập:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {contest.problems.length} bài
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Điểm tối đa:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {totalScore}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Thời lượng:
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {contest.durationMinutes} phút
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
