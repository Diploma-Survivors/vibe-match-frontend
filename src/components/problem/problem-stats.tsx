"use client";

import type { Problem } from "@/types/problem";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import React, { useMemo } from "react";

interface ProblemStatsProps {
  problems: Problem[];
}

export default function ProblemStats({ problems }: ProblemStatsProps) {
  const stats = useMemo(() => {
    const total = problems.length;
    const avgAcceptance =
      problems.reduce((acc, p) => acc + p.acceptanceRate, 0) / total || 0;
    const totalSubmissions = problems.reduce(
      (acc, p) => acc + p.submissionCount,
      0
    );

    return {
      total,
      avgAcceptance,
      totalSubmissions,
    };
  }, [problems]);

  const statItems = [
    {
      icon: BookOpen,
      label: "Tổng bài",
      value: stats.total.toLocaleString(),
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-green-600 dark:text-emerald-400",
    },
    {
      icon: TrendingUp,
      label: "Tỷ lệ AC",
      value: `${stats.avgAcceptance.toFixed(1)}%`,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Users,
      label: "Lượt nộp",
      value: stats.totalSubmissions.toLocaleString(),
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.label}
            className={`${item.bgColor} backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${item.bgColor} ring-1 ring-white/20 dark:ring-slate-700/50 group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
