"use client";

import RankingItem from "@/components/ranking-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockGlobalRanking } from "@/lib/data/mock-contests";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function RankingList() {
    return (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 overflow-hidden h-fit">
            <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center">
                        <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    🌟 Global Ranking
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Top các lập trình viên hàng đầu thế giới
                </p>
            </div>

            <div className="max-h-[700px] overflow-y-auto custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-3 p-4"
                >
                    {mockGlobalRanking.map((user, index) => (
                        <RankingItem key={user.id} user={user} index={index} />
                    ))}
                </motion.div>
            </div>

            {/* View All Button */}
            <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-700/20 dark:to-slate-800/20">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-all duration-200 py-2.5 px-4 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                    Xem tất cả bảng xếp hạng →
                </motion.button>
            </div>
        </div>
    );
}
