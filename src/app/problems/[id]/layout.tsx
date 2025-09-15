"use client";

import { ProblemNavbar } from "@/components/problem";
import { mockProblems } from "@/lib/data/mock-problems";
import type { Problem } from "@/types/problem";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldHideNavigation, isMoodleIssuer } = useApp();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const problemId = params.id as string;
  const [problem, setProblem] = useState<Problem | null>(null);

  // Extract active tab from pathname
  const activeTab = pathname.split("/").pop() || "problem";

  useEffect(() => {
    const foundProblem = mockProblems.find((p) => p.id === problemId);
    setProblem(foundProblem || null);
  }, [problemId]);

  const handleTabChange = (tab: string) => {
    router.push(`/problems/${problemId}/${tab}`);
  };

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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Problem Navigation */}
      <ProblemNavbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content - Full Width for all tabs */}
      <div className="container mx-auto px-4 bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}
