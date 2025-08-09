"use client";

import ProblemDescription from "@/components/problem-description";
import ProblemNavbar from "@/components/problem-navbar";
import ProblemSidebar from "@/components/problem-sidebar";
import { mockProblems } from "@/lib/data/mock-problems";
import type { Problem } from "@/types/problem";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProblemSolvingPage() {
  const params = useParams();
  const problemId = params.id as string;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState("problem");

  useEffect(() => {
    const foundProblem = mockProblems.find((p) => p.id === problemId);
    setProblem(foundProblem || null);
  }, [problemId]);

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
            Không tìm thấy bài tập
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Bài tập với ID "{problemId}" không tồn tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Problem Navigation */}
      <ProblemNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === "submit" || activeTab === "status" ? (
          /* Submit and Status Tabs - Full Width Layout */
          <div>
            <ProblemDescription problem={problem} activeTab={activeTab} />
          </div>
        ) : (
          /* Other Tabs - Two Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Problem Description */}
            <div className="lg:col-span-8 xl:col-span-9">
              <ProblemDescription problem={problem} activeTab={activeTab} />
            </div>

            {/* Right Column - Problem Sidebar (only for non-submit tabs) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <ProblemSidebar problem={problem} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
