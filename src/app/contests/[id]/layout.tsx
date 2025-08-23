"use client";
import { ContestNavbar } from "@/components/contest";
import { mockContests } from "@/lib/data/mock-contests";
import type { Contest } from "@/types/contest";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContestLayout({
  children,
}: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const contestId = params.id as string;
  const [contest, setContest] = useState<Contest | null>(null);
  const activeTab = pathname.split("/").pop() || "info";

  useEffect(() => {
    const found = mockContests.find((c) => c.id === contestId);
    setContest(found || null);
  }, [contestId]);

  const handleTabChange = (tab: string) => {
    router.push(`/contests/${contestId}/${tab}`);
  };

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-300">
        Contest not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <ContestNavbar
        contest={contest}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
