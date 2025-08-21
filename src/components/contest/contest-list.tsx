"use client";

import ContestTable from "./contest-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContestsByStatus } from "@/lib/data/mock-contests";
import type { Contest } from "@/types/contest";
import { motion } from "framer-motion";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function ContestList() {
    const { upcoming, ongoing, finished } = getContestsByStatus();
    const [currentPage, setCurrentPage] = useState<Record<string, number>>({
        upcoming: 1,
        ongoing: 1,
        finished: 1,
    });

    const getPaginatedContests = (contests: Contest[], status: string) => {
        const page = currentPage[status] || 1;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return contests.slice(startIndex, endIndex);
    };

    const getTotalPages = (contests: Contest[]) => {
        return Math.ceil(contests.length / ITEMS_PER_PAGE);
    };

    const handlePageChange = (status: string, newPage: number) => {
        setCurrentPage(prev => ({
            ...prev,
            [status]: newPage,
        }));
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3 gap-2 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl rounded-xl h-auto min-h-[60px]">
                    <TabsTrigger
                        value="upcoming"
                        className="flex items-center justify-between gap-2 px-3 py-3 rounded-lg transition-all duration-300 font-medium min-w-0 flex-1
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 
                        data-[state=active]:text-white data-[state=active]:shadow-lg
                        hover:bg-blue-50 dark:hover:bg-blue-950/50
                        text-slate-600 dark:text-slate-300"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg flex-shrink-0">🚀</span>
                            <span className="text-sm font-medium truncate">Sắp diễn ra</span>
                        </div>
                        {upcoming.length > 0 && (
                            <span className="bg-blue-500 data-[state=active]:bg-white/20 text-white px-2 py-1 rounded-full text-xs font-bold flex-shrink-0">
                                {upcoming.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="ongoing"
                        className="flex items-center justify-between gap-2 px-3 py-3 rounded-lg transition-all duration-300 font-medium min-w-0 flex-1
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 
                        data-[state=active]:text-white data-[state=active]:shadow-lg
                        hover:bg-green-50 dark:hover:bg-green-950/50
                        text-slate-600 dark:text-slate-300"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg flex-shrink-0">⚡</span>
                            <span className="text-sm font-medium truncate">Đang diễn ra</span>
                        </div>
                        {ongoing.length > 0 && (
                            <span className="bg-green-500 data-[state=active]:bg-white/20 text-white px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 animate-pulse">
                                {ongoing.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="finished"
                        className="flex items-center justify-between gap-2 px-3 py-3 rounded-lg transition-all duration-300 font-medium min-w-0 flex-1
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 
                        data-[state=active]:text-white data-[state=active]:shadow-lg
                        hover:bg-amber-50 dark:hover:bg-amber-950/50
                        text-slate-600 dark:text-slate-300"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg flex-shrink-0">🏆</span>
                            <span className="text-sm font-medium truncate">Đã kết thúc</span>
                        </div>
                        {finished.length > 0 && (
                            <span className="bg-amber-500 data-[state=active]:bg-white/20 text-white px-2 py-1 rounded-full text-xs font-bold flex-shrink-0">
                                {finished.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                    {upcoming.length > 0 ? (
                        <motion.div
                            key={`upcoming-${currentPage.upcoming}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ContestTable
                                contests={getPaginatedContests(upcoming, "upcoming")}
                                currentPage={currentPage.upcoming}
                                totalPages={getTotalPages(upcoming)}
                                onPageChange={(page) => handlePageChange("upcoming", page)}
                                title="🔥 Cuộc thi sắp diễn ra"
                            />
                        </motion.div>
                    ) : (
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Chưa có cuộc thi nào sắp diễn ra
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Hãy theo dõi để không bỏ lỡ các cuộc thi sắp tới
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="ongoing" className="mt-6">
                    {ongoing.length > 0 ? (
                        <motion.div
                            key={`ongoing-${currentPage.ongoing}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ContestTable
                                contests={getPaginatedContests(ongoing, "ongoing")}
                                currentPage={currentPage.ongoing}
                                totalPages={getTotalPages(ongoing)}
                                onPageChange={(page) => handlePageChange("ongoing", page)}
                                title="⚡ Cuộc thi đang diễn ra"
                            />
                        </motion.div>
                    ) : (
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center">
                            <div className="text-6xl mb-4">⏰</div>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Hiện tại không có cuộc thi nào đang diễn ra
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Tham gia ngay khi có cuộc thi mới bắt đầu
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="finished" className="mt-6">
                    {finished.length > 0 ? (
                        <motion.div
                            key={`finished-${currentPage.finished}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ContestTable
                                contests={getPaginatedContests(finished, "finished")}
                                currentPage={currentPage.finished}
                                totalPages={getTotalPages(finished)}
                                onPageChange={(page) => handlePageChange("finished", page)}
                                title="🏆 Cuộc thi đã kết thúc"
                            />
                        </motion.div>
                    ) : (
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center">
                            <div className="text-6xl mb-4">🏁</div>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Chưa có cuộc thi nào kết thúc
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Lịch sử các cuộc thi sẽ hiển thị tại đây
                            </p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
