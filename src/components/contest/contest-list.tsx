"use client";

import ContestCardList from "./contest-card-list";
import { getContestsByStatus } from "@/lib/data/mock-contests";
import type { Contest } from "@/types/contest";
import { motion } from "framer-motion";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function ContestList() {
  const { upcoming, ongoing, finished } = getContestsByStatus();
  const [currentPage, setCurrentPage] = useState(1);

  // Combine all contests
  const allContests = [...upcoming, ...ongoing, ...finished];

  const getPaginatedContests = (contests: Contest[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return contests.slice(startIndex, endIndex);
  };

  const getTotalPages = (contests: Contest[]) => {
    return Math.ceil(contests.length / ITEMS_PER_PAGE);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      {allContests.length > 0 ? (
        <motion.div
          key={`contests-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ContestCardList
            contests={getPaginatedContests(allContests)}
            currentPage={currentPage}
            totalPages={getTotalPages(allContests)}
            onPageChange={handlePageChange}
            title="🏆 Danh sách cuộc thi"
          />
        </motion.div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Không tìm thấy cuộc thi nào
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Hãy thử thay đổi bộ lọc để tìm kiếm cuộc thi phù hợp
          </p>
        </div>
      )}
    </div>
  );
}
