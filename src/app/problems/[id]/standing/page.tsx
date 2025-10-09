'use client';

import { ProblemSidebar } from '@/components/problem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Problem } from '@/types/problem-test';
import {
  AlertCircle,
  BarChart3,
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Code2,
  Copy,
  FileText,
  Filter,
  MemoryStick,
  MessageCircle,
  Play,
  Plus,
  Search,
  Send,
  Share,
  Sparkles,
  TestTube,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function ProblemStandingPage() {
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  🏆 Leaderboard
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Top performers for mock problem
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all-time">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="p-6">
          {/* Top 3 Podium */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              👑 Top 3 Champions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Place */}
              <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl order-2 md:order-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-yellow-800 font-bold text-sm">
                      🥇
                    </span>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=champion1"
                      alt="Champion 1"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <h4 className="font-bold text-lg">CodeMaster2024</h4>
                  <p className="text-yellow-100 text-sm mb-2">Expert Level</p>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-xs text-yellow-100">Best Time</div>
                    <div className="text-lg font-bold">47ms</div>
                    <div className="text-xs text-yellow-100">Memory: 1.2MB</div>
                  </div>
                </div>
              </div>

              {/* Second Place */}
              <div className="relative bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl p-6 text-slate-800 transform hover:scale-105 transition-all duration-300 shadow-xl order-1 md:order-2">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-slate-600 font-bold text-sm">🥈</span>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=runner1"
                      alt="Runner 1"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <h4 className="font-bold text-lg">AlgoNinja</h4>
                  <p className="text-slate-600 text-sm mb-2">Advanced Level</p>
                  <div className="bg-white/30 rounded-lg p-3">
                    <div className="text-xs text-slate-600">Best Time</div>
                    <div className="text-lg font-bold">52ms</div>
                    <div className="text-xs text-slate-600">Memory: 1.3MB</div>
                  </div>
                </div>
              </div>

              {/* Third Place */}
              <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl order-3">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-amber-800 font-bold text-sm">🥉</span>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=runner2"
                      alt="Runner 2"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <h4 className="font-bold text-lg">PyThonista</h4>
                  <p className="text-amber-200 text-sm mb-2">Advanced Level</p>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-xs text-amber-200">Best Time</div>
                    <div className="text-lg font-bold">61ms</div>
                    <div className="text-xs text-amber-200">Memory: 1.4MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                📋 Full Rankings
              </h3>
              <div className="flex items-center gap-2">
                <Select defaultValue="fastest">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fastest">Fastest Time</SelectItem>
                    <SelectItem value="memory">Lowest Memory</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Runtime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Memory
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {[
                      {
                        rank: 1,
                        user: 'CodeMaster2024',
                        level: 'Expert',
                        avatar: 'champion1',
                        lang: 'C++17',
                        runtime: '47ms',
                        memory: '1.2MB',
                        time: '2 hours ago',
                        badge: '🥇',
                      },
                      {
                        rank: 2,
                        user: 'AlgoNinja',
                        level: 'Advanced',
                        avatar: 'runner1',
                        lang: 'Python 3',
                        runtime: '52ms',
                        memory: '1.3MB',
                        time: '3 hours ago',
                        badge: '🥈',
                      },
                      {
                        rank: 3,
                        user: 'PyThonista',
                        level: 'Advanced',
                        avatar: 'runner2',
                        lang: 'Java 17',
                        runtime: '61ms',
                        memory: '1.4MB',
                        time: '5 hours ago',
                        badge: '🥉',
                      },
                      {
                        rank: 4,
                        user: 'DevGuru',
                        level: 'Intermediate',
                        avatar: 'user4',
                        lang: 'TypeScript',
                        runtime: '73ms',
                        memory: '1.5MB',
                        time: '6 hours ago',
                        badge: '🔥',
                      },
                      {
                        rank: 5,
                        user: 'CodeNinja99',
                        level: 'Intermediate',
                        avatar: 'user5',
                        lang: 'C++17',
                        runtime: '89ms',
                        memory: '1.6MB',
                        time: '8 hours ago',
                        badge: '⚡',
                      },
                      {
                        rank: 6,
                        user: 'FastCoder',
                        level: 'Beginner',
                        avatar: 'user6',
                        lang: 'Python 3',
                        runtime: '94ms',
                        memory: '1.7MB',
                        time: '1 day ago',
                        badge: '💪',
                      },
                      {
                        rank: 7,
                        user: 'QuickSolver',
                        level: 'Beginner',
                        avatar: 'user7',
                        lang: 'JavaScript',
                        runtime: '108ms',
                        memory: '1.8MB',
                        time: '1 day ago',
                        badge: '🚀',
                      },
                      {
                        rank: 8,
                        user: 'BugHunter',
                        level: 'Intermediate',
                        avatar: 'user8',
                        lang: 'C# 10',
                        runtime: '115ms',
                        memory: '1.9MB',
                        time: '2 days ago',
                        badge: '🎯',
                      },
                    ].map((entry) => (
                      <tr
                        key={entry.rank}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              #{entry.rank}
                            </span>
                            <span className="text-lg">{entry.badge}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.avatar}`}
                              alt={entry.user}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {entry.user}
                              </div>
                              <div
                                className={`text-xs ${
                                  entry.level === 'Expert'
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : entry.level === 'Advanced'
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : entry.level === 'Intermediate'
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-yellow-600 dark:text-yellow-400'
                                }`}
                              >
                                {entry.level}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.lang.includes('C++')
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : entry.lang.includes('Python')
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : entry.lang.includes('Java')
                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                    : entry.lang.includes('JavaScript') ||
                                        entry.lang.includes('TypeScript')
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}
                          >
                            {entry.lang}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                          {entry.runtime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                          {entry.memory}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {entry.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Load More Button */}
            <div className="text-center mt-6">
              <Button variant="outline" className="px-8">
                Load More Rankings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
