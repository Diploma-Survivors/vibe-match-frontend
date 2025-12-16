'use client';

import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { ProblemsService } from '@/services/problems-service';
import { SubmissionsService } from '@/services/submissions-service';
import { UserService } from '@/services/user-service';
import { ProblemDifficulty, type ProblemListItem } from '@/types/problems';
import { type SubmissionListItem, SubmissionStatus } from '@/types/submissions';
import type { UserProfile } from '@/types/user';
import { format } from 'date-fns';
import {
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Trophy,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type MonthKey =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

const monthWidths: Record<string, number> = {
  Jan: 82,
  Feb: 63,
  Mar: 70,
  Apr: 62,
  May: 75,
  Jun: 70,
  Jul: 70,
  Aug: 70,
  Sep: 73,
  Oct: 65,
  Nov: 65,
  Dec: 65,
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState<ProblemListItem[]>([]);
  const [allProblems, setAllProblems] = useState<ProblemListItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  W;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, solvedData, allData, submissionsData] =
          await Promise.all([
            UserService.getUserProfile(),
            ProblemsService.getSolvedProblems(),
            ProblemsService.getAllProblems(),
            SubmissionsService.getAllSubmissions(),
          ]);
        setUser(userData);
        setSolvedProblems(solvedData);
        setAllProblems(allData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    // In a real app, we would call an API to update the user here
  };

  // Stats Calculation
  const getDifficultyStats = (difficulty: ProblemDifficulty) => {
    const solvedCount = solvedProblems.filter(
      (p) => p.difficulty === difficulty
    ).length;
    const totalCount = allProblems.filter(
      (p) => p.difficulty === difficulty
    ).length;
    return { solved: solvedCount, total: totalCount };
  };

  const easyStats = getDifficultyStats(ProblemDifficulty.EASY);
  const mediumStats = getDifficultyStats(ProblemDifficulty.MEDIUM);
  const hardStats = getDifficultyStats(ProblemDifficulty.HARD);
  const totalSolved = solvedProblems.length;
  const totalProblems = allProblems.length;

  // Submission Stats
  const getSubmissionStats = () => {
    const stats: Record<string, number> = {
      [SubmissionStatus.ACCEPTED]: 0,
      [SubmissionStatus.WRONG_ANSWER]: 0,
      [SubmissionStatus.RUNTIME_ERROR]: 0,
      [SubmissionStatus.TIME_LIMIT_EXCEEDED]: 0,
      [SubmissionStatus.COMPILATION_ERROR]: 0,
      others: 0,
    };

    for (const s of submissions) {
      if (stats[s.status] !== undefined) {
        stats[s.status]++;
      } else {
        stats.others++;
      }
    }
    return stats;
  };

  const submissionStats = getSubmissionStats();

  // Heatmap Data
  const getHeatmapData = () => {
    const year = Number.parseInt(selectedYear);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Create a map of date -> submission count
    const submissionMap = new Map<string, number>();
    const activeDays = new Set();

    for (const sub of submissions) {
      if (!sub.createdAt) continue;
      const date = new Date(sub.createdAt);
      if (date.getFullYear() === year) {
        const dateStr = format(date, 'yyyy-MM-dd');
        submissionMap.set(dateStr, (submissionMap.get(dateStr) || 0) + 1);
        activeDays.add(dateStr);
      }
    }

    // Generate grid data
    const grid = [];
    const months = [];
    let currentMonth = -1;
    const weekCount = 0;

    // Pad start to align with Sunday (0) or Monday (1)
    // Let's assume Monday start for GitHub style
    const startDay = startDate.getDay(); // 0 is Sunday
    const padding = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start

    for (let i = 0; i < padding; i++) {
      grid.push({ id: `pad-${i}`, isPadding: true, date: '', count: 0 });
    }

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const month = d.getMonth();

      if (month !== currentMonth) {
        months.push({ label: format(d, 'MMM'), weeks: 0 });
        currentMonth = month;
      }

      // Increment week count for the current month
      // This is a rough approximation, better to count weeks based on column index
      if (months.length > 0) {
        // Check if it's the start of a new column (Monday)
        if (d.getDay() === 1) {
          months[months.length - 1].weeks++;
        }
      }

      grid.push({
        id: dateStr,
        isPadding: false,
        date: dateStr,
        count: submissionMap.get(dateStr) || 0,
      });
    }

    // Fix month week counts - simple distribution
    // Total weeks approx 53. Distribute evenly or based on day count?
    // Let's just use a fixed width for now in UI or calculate better.
    // Re-calculating months based on grid columns
    const totalDays = grid.length;
    const totalWeeks = Math.ceil(totalDays / 7);
    const monthLabels = [];
    const currentWeekIndex = 0;

    for (let m = 0; m < 12; m++) {
      const firstDayOfMonth = new Date(year, m, 1);
      // Find which week index this day falls into
      const dayOfYear =
        Math.floor(
          (firstDayOfMonth.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + padding;
      const weekIndex = Math.floor(dayOfYear / 7);

      // Calculate duration in weeks until next month
      const nextMonth = new Date(year, m + 1, 1);
      const nextMonthDayOfYear =
        Math.floor(
          (nextMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + padding;
      const nextMonthWeekIndex = Math.floor(nextMonthDayOfYear / 7);

      monthLabels.push({
        label: format(firstDayOfMonth, 'MMM'),
        weeks: nextMonthWeekIndex - weekIndex,
      });
    }

    return { grid, months: monthLabels, totalActiveDays: activeDays.size };
  };

  const heatmapData = getHeatmapData();
  const totalActiveDays = heatmapData.totalActiveDays;

  // Recent Activity (AC Problems)
  const getRecentACProblems = () => {
    const acSubmissions = submissions
      .filter((s) => s.status === SubmissionStatus.ACCEPTED && s.createdAt)
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

    // Deduplicate by problemId, keeping the latest
    const uniqueAC = new Map<string, SubmissionListItem>();
    for (const s of acSubmissions) {
      if (s.problemId && !uniqueAC.has(s.problemId)) {
        uniqueAC.set(s.problemId, s);
      }
    }

    return Array.from(uniqueAC.values()).map((s) => {
      const problem = allProblems.find((p) => p.id === s.problemId);
      return {
        ...s,
        problemTitle: problem?.title || 'Unknown Problem',
      };
    });
  };

  const recentAC = getRecentACProblems();

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column Skeleton */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card className="shadow-lg border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-2 w-full flex flex-col items-center">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <div className="w-full space-y-3 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Stats Row Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="flex items-center justify-center space-x-8">
                  <Skeleton className="w-32 h-32 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Skeleton className="w-32 h-32 rounded-full" />
                  <div className="space-y-2 w-1/2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap Skeleton */}
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-6 w-64" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-[120px] w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Skeleton */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: User Profile Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <Card className="shadow-lg border-none">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-md"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 font-medium">{user.username}</p>
              </div>
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1"
              >
                <Trophy className="w-3 h-3 mr-1" />
                {`Rank ${user.rank}`}
              </Badge>

              <Button
                className="w-full bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa hồ sơ
              </Button>

              <div className="w-full space-y-3 pt-4 text-left">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate">{user.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate">{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate">Tham gia Dec 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats, Heatmap, Activity */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solved Problems Chart */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Bài tập đã giải</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center space-x-8">
                <Tooltip
                  content={`${((totalSolved / (totalProblems || 1)) * 100).toFixed(1)}%`}
                >
                  <div className="relative w-32 h-32 flex items-center justify-center cursor-pointer">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <title>Biểu đồ bài tập đã giải</title>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray={`${(totalSolved / (totalProblems || 1)) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalSolved}/{totalProblems}
                      </span>
                      <span className="text-xs text-gray-500">Đã giải</span>
                    </div>
                  </div>
                </Tooltip>

                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 font-medium">Dễ</span>
                    <span className="font-bold">
                      {easyStats.solved}
                      <span className="text-gray-400 font-normal">
                        /{easyStats.total}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(easyStats.solved / (easyStats.total || 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-600 font-medium">
                      Trung bình
                    </span>
                    <span className="font-bold">
                      {mediumStats.solved}
                      <span className="text-gray-400 font-normal">
                        /{mediumStats.total}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(mediumStats.solved / (mediumStats.total || 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-600 font-medium">Khó</span>
                    <span className="font-bold">
                      {hardStats.solved}
                      <span className="text-gray-400 font-normal">
                        /{hardStats.total}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${(hardStats.solved / (hardStats.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Status Chart */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Thống kê submissions</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                {/* Pie Chart */}
                <div className="relative w-32 h-32">
                  <svg
                    viewBox="0 0 32 32"
                    className="w-full h-full transform -rotate-90"
                  >
                    <title>Biểu đồ trạng thái nộp bài</title>
                    {(() => {
                      const total = submissions.length || 1;
                      let cumulativePercent = 0;
                      const data = [
                        { status: SubmissionStatus.ACCEPTED, color: '#10b981' },
                        {
                          status: SubmissionStatus.WRONG_ANSWER,
                          color: '#ef4444',
                        },
                        {
                          status: SubmissionStatus.TIME_LIMIT_EXCEEDED,
                          color: '#eab308',
                        },
                        {
                          status: SubmissionStatus.RUNTIME_ERROR,
                          color: '#f97316',
                        },
                        { status: 'others', color: '#6b7280' },
                      ];

                      return data.map((item) => {
                        const count =
                          item.status === 'others'
                            ? (submissionStats[
                                SubmissionStatus.COMPILATION_ERROR
                              ] || 0) + (submissionStats.others || 0)
                            : submissionStats[
                                item.status as SubmissionStatus
                              ] || 0;

                        if (count === 0) return null;

                        const percent = (count / total) * 100;
                        const startPercent = cumulativePercent;
                        cumulativePercent += percent;

                        // Calculate SVG path for pie slice
                        const x1 =
                          16 +
                          16 * Math.cos((2 * Math.PI * startPercent) / 100);
                        const y1 =
                          16 +
                          16 * Math.sin((2 * Math.PI * startPercent) / 100);
                        const x2 =
                          16 +
                          16 *
                            Math.cos((2 * Math.PI * cumulativePercent) / 100);
                        const y2 =
                          16 +
                          16 *
                            Math.sin((2 * Math.PI * cumulativePercent) / 100);

                        const largeArcFlag = percent > 50 ? 1 : 0;

                        return (
                          <Tooltip
                            key={item.status}
                            content={`${item.status}: ${percent.toFixed(1)}%`}
                          >
                            <path
                              d={`M 16 16 L ${x1} ${y1} A 16 16 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={item.color}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          </Tooltip>
                        );
                      });
                    })()}
                  </svg>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Accepted:</span>
                    <span className="font-bold">
                      {submissionStats[SubmissionStatus.ACCEPTED] || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600">Wrong Answer:</span>
                    <span className="font-bold">
                      {submissionStats[SubmissionStatus.WRONG_ANSWER] || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-bold">
                      {submissionStats[SubmissionStatus.TIME_LIMIT_EXCEEDED] ||
                        0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-gray-600">Runtime Error:</span>
                    <span className="font-bold">
                      {submissionStats[SubmissionStatus.RUNTIME_ERROR] || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-gray-600">Others:</span>
                    <span className="font-bold">
                      {(submissionStats[SubmissionStatus.COMPILATION_ERROR] ||
                        0) + (submissionStats.others || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contribution Graph */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                {submissions.length} submissions trong một năm qua
              </CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Số ngày hoạt động: {totalActiveDays}
                </span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Năm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[820px]">
                  {/* Month Labels */}
                  <div className="flex text-xs text-gray-500 mb-2 ml-8">
                    {heatmapData.months.map((month) => (
                      <div
                        key={month.label}
                        style={{ width: `${monthWidths[month.label]}px` }} // Approx width per week
                      >
                        {month.label}
                      </div>
                    ))}
                  </div>

                  <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500 pt-5">
                      <div className="h-3">Mon</div>
                      <div className="h-3" />
                      <div className="h-3">Wed</div>
                      <div className="h-3" />
                      <div className="h-3">Fri</div>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                      {heatmapData.grid.map((day) => {
                        if (day.isPadding) {
                          return <div key={day.id} className="w-3 h-3" />;
                        }
                        return (
                          <Tooltip
                            key={day.id}
                            content={`${day.count} submissions on ${day.date}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-sm ${
                                day.count === 0
                                  ? 'bg-gray-100'
                                  : day.count < 3
                                    ? 'bg-green-200'
                                    : day.count < 6
                                      ? 'bg-green-400'
                                      : 'bg-green-600'
                              }`}
                            />
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <Tabs defaultValue="ac_problems" className="w-full">
                <TabsList>
                  <TabsTrigger value="ac_problems">Bài tập đã AC</TabsTrigger>
                  <TabsTrigger value="solutions">Solution</TabsTrigger>
                </TabsList>
                <TabsContent value="ac_problems" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bài tập</TableHead>
                        <TableHead>Thời gian giải</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAC.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.problemTitle}
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {item.createdAt
                              ? format(
                                  new Date(item.createdAt),
                                  'yyyy-MM-dd HH:mm'
                                )
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {recentAC.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center text-gray-500"
                          >
                            Chưa có bài tập nào được giải.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="solutions">
                  <div className="p-4 text-center text-gray-500">
                    Sắp ra mắt...
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
