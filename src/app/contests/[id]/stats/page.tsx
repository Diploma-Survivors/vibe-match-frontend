'use client';
import {
  Award,
  BarChart3,
  Clock,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ContestStatsPage() {
  const params = useParams();

  // Mock data for statistics
  const stats = {
    submissions: 15426,
    solvedProblems: 8432,
    averageTime: '45:32',
    topScore: 4850,
    languages: [
      { name: 'C++', count: 8942, percentage: 58, color: 'bg-blue-500' },
      { name: 'Python', count: 4231, percentage: 27, color: 'bg-green-500' },
      { name: 'Java', count: 1876, percentage: 12, color: 'bg-orange-500' },
      { name: 'C', count: 377, percentage: 3, color: 'bg-purple-500' },
    ],
    problemStats: [
      {
        problem: 'A',
        title: 'Tìm số lớn nhất',
        solved: 2847,
        attempted: 3241,
        difficulty: 'Dễ',
        color: 'bg-green-500',
      },
      {
        problem: 'B',
        title: 'Đếm số cặp',
        solved: 1932,
        attempted: 2876,
        difficulty: 'Dễ',
        color: 'bg-green-500',
      },
      {
        problem: 'C',
        title: 'Dãy con tăng dài nhất',
        solved: 876,
        attempted: 2156,
        difficulty: 'Trung bình',
        color: 'bg-yellow-500',
      },
      {
        problem: 'D',
        title: 'Cây khung nhỏ nhất',
        solved: 543,
        attempted: 1892,
        difficulty: 'Trung bình',
        color: 'bg-yellow-500',
      },
      {
        problem: 'E',
        title: 'Đường đi ngắn nhất',
        solved: 234,
        attempted: 1456,
        difficulty: 'Khó',
        color: 'bg-red-500',
      },
      {
        problem: 'F',
        title: 'Thuật toán động',
        solved: 123,
        attempted: 987,
        difficulty: 'Khó',
        color: 'bg-red-500',
      },
      {
        problem: 'G',
        title: 'Cấu trúc dữ liệu',
        solved: 67,
        attempted: 543,
        difficulty: 'Rất khó',
        color: 'bg-gray-800',
      },
      {
        problem: 'H',
        title: 'Lý thuyết số',
        solved: 23,
        attempted: 234,
        difficulty: 'Rất khó',
        color: 'bg-gray-800',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Thống kê cuộc thi #{params.id}
            </h1>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tổng bài nộp
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.submissions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Bài đã AC
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.solvedProblems.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Thời gian TB
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.averageTime}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Điểm cao nhất
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.topScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Programming Languages Chart */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Ngôn ngữ lập trình
              </h3>
            </div>
            <div className="space-y-4">
              {stats.languages.map((lang, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {lang.name}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {lang.count.toLocaleString()} ({lang.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={`${lang.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Statistics */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Thống kê theo bài
              </h3>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {stats.problemStats.map((problem, index) => {
                const solveRate = Math.round(
                  (problem.solved / problem.attempted) * 100
                );
                return (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                            {problem.problem}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium text-white ${problem.color}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {problem.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {solveRate}%
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {problem.solved}/{problem.attempted}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${solveRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
