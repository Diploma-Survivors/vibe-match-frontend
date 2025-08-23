"use client";

import type { Contest } from "@/types/contest";
import { Calendar, Trophy, Users } from "lucide-react";
import React, { useMemo } from "react";

interface ContestStatsProps {
  contests: Contest[];
}

export default function ContestStats({ contests }: ContestStatsProps) {
  const stats = useMemo(() => {
    const total = contests.length;
    const upcoming = contests.filter((c) => c.status === "upcoming").length;
    const ongoing = contests.filter((c) => c.status === "ongoing").length;
    const finished = contests.filter((c) => c.status === "finished").length;
    const totalParticipants = contests.reduce(
      (acc, c) => acc + c.participantCount,
      0
    );

    return {
      total,
      upcoming,
      ongoing,
      finished,
      totalParticipants,
    };
  }, [contests]);

  const statItems = [
    {
      icon: Trophy,
      label: "Tổng cuộc thi",
      value: stats.total.toLocaleString(),
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Calendar,
      label: "Sắp diễn ra",
      value: stats.upcoming.toLocaleString(),
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      label: "Tổng thí sinh",
      value: stats.totalParticipants.toLocaleString(),
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <div
              className={`${item.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
            >
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
