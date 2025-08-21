"use client";

import type { User } from "@/types/contest";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";

interface RankingItemProps {
    user: User;
    index: number;
}

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return <Crown className="w-4 h-4 text-yellow-500" />;
        case 2:
            return <Medal className="w-4 h-4 text-gray-400" />;
        case 3:
            return <Trophy className="w-4 h-4 text-orange-500" />;
        default:
            return rank;
    }
};

const getRankStyles = (rank: number) => {
    switch (rank) {
        case 1:
            return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200 dark:shadow-yellow-900/30";
        case 2:
            return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200 dark:shadow-gray-800/30";
        case 3:
            return "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30";
        default:
            return "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";
    }
};

const getRatingColor = (rating: number) => {
    if (rating >= 3500) return "text-red-600 dark:text-red-400";
    if (rating >= 3000) return "text-orange-600 dark:text-orange-400";
    if (rating >= 2500) return "text-yellow-600 dark:text-yellow-400";
    if (rating >= 2000) return "text-purple-600 dark:text-purple-400";
    if (rating >= 1500) return "text-blue-600 dark:text-blue-400";
    if (rating >= 1000) return "text-green-600 dark:text-green-400";
    return "text-gray-600 dark:text-gray-400";
};

const getAvatarGradient = (rank: number, rating: number) => {
    if (rank <= 3) {
        switch (rank) {
            case 1: return "from-yellow-400 to-yellow-600";
            case 2: return "from-gray-300 to-gray-500";
            case 3: return "from-orange-400 to-orange-600";
        }
    }

    if (rating >= 3500) return "from-red-400 to-red-600";
    if (rating >= 3000) return "from-orange-400 to-orange-600";
    if (rating >= 2500) return "from-yellow-400 to-yellow-600";
    if (rating >= 2000) return "from-purple-400 to-purple-600";
    if (rating >= 1500) return "from-blue-400 to-blue-600";
    if (rating >= 1000) return "from-green-400 to-green-600";
    return "from-slate-400 to-slate-600";
};

export default function RankingItem({ user, index }: RankingItemProps) {
    const isTopThree = user.rank <= 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group cursor-pointer"
        >
            <div className={`
        flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300
        ${isTopThree
                    ? 'bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 border-2 border-slate-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl'
                    : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/30 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600'
                }
        backdrop-blur-sm hover:shadow-lg group-hover:scale-[1.02]
      `}>

                {/* Rank */}
                <div className="flex-shrink-0">
                    <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
            ${getRankStyles(user.rank)}
            ${isTopThree ? 'ring-2 ring-white/50 dark:ring-slate-900/50' : ''}
          `}>
                        {getRankIcon(user.rank)}
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className={`
            relative rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110
            ${isTopThree ? 'w-12 h-12 sm:w-14 sm:h-14 ring-3 ring-slate-200/50 dark:ring-slate-600/50' : 'w-10 h-10 sm:w-12 sm:h-12'}
          `}>
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = `w-full h-full bg-gradient-to-br ${getAvatarGradient(user.rank, user.rating)} flex items-center justify-center text-white font-bold text-lg shadow-inner`;
                                    fallback.textContent = user.username.charAt(0).toUpperCase();
                                    target.parentElement?.appendChild(fallback);
                                }}
                            />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getAvatarGradient(user.rank, user.rating)} flex items-center justify-center text-white font-bold text-lg shadow-inner`}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Top 3 crown overlay */}
                        {isTopThree && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 text-white">
                                    {user.rank === 1 && <Crown className="w-full h-full" />}
                                    {user.rank === 2 && <Medal className="w-full h-full" />}
                                    {user.rank === 3 && <Trophy className="w-full h-full" />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                        <h4 className={`
              font-bold truncate transition-colors duration-200
              ${isTopThree
                                ? 'text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                : 'text-base text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                            }
            `}>
                            {user.username}
                        </h4>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Rating:</span>
                                <span className={`font-bold ${getRatingColor(user.rating)}`}>
                                    {user.rating.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-500 dark:text-slate-400">Contests:</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {user.attendedContests}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Display */}
                <div className="flex-shrink-0 hidden sm:block">
                    <div className={`
            px-3 py-1.5 rounded-lg font-mono font-bold text-sm
            ${isTopThree
                            ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }
          `}>
                        {user.rating.toLocaleString()}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
