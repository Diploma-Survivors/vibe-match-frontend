'use client';

import ContestDrawer from '@/components/contest/contest-drawer';
import ContestTopBar from '@/components/contest/contest-topbar';
import ContestProblemWrapper from '@/components/problems/tabs/description/contest-problem-wrapper';
import { ContestsService } from '@/services/contests-service';
import { ProblemsService } from '@/services/problems-service';
import type { Contest } from '@/types/contests';
import type { ProblemDescription } from '@/types/problems';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface ProblemStatus {
  problemId: string;
  status: 'unsolved' | 'attempted' | 'solved';
}

// Mock ranking data - replace with actual API call
const MOCK_RANKING = [
  {
    rank: 1,
    username: 'alice_coder',
    score: 900,
    timeSpent: '45:23',
    problemsSolved: 5,
  },
  {
    rank: 2,
    username: 'bob_dev',
    score: 700,
    timeSpent: '52:15',
    problemsSolved: 4,
  },
  {
    rank: 3,
    username: 'charlie_prog',
    score: 600,
    timeSpent: '48:30',
    problemsSolved: 3,
  },
  {
    rank: 4,
    username: 'you',
    score: 100,
    timeSpent: '15:42',
    problemsSolved: 1,
    isCurrentUser: true,
  },
  {
    rank: 5,
    username: 'dave_algo',
    score: 100,
    timeSpent: '20:11',
    problemsSolved: 1,
  },
];

export default function ContestSolvePage() {
  const params = useParams();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [currentProblem, setCurrentProblem] =
    useState<ProblemDescription | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Track problem statuses (in real app, this would come from backend)
  const [problemStatuses, setProblemStatuses] = useState<
    Record<string, ProblemStatus>
  >({});

  // Fetch contest data
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setLoading(true);
        const response = await ContestsService.getContestById(contestId);
        const contestData = response?.data?.data as Contest;
        setContest(contestData);

        // Load first problem
        if (contestData?.problems?.[0]) {
          const problemData = await ProblemsService.getProblemById(
            contestData.problems[0].id
          );
          setCurrentProblem(problemData);
          setCurrentProblemIndex(0);
        }
      } catch (error) {
        console.error('Error fetching contest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContestData();
  }, [contestId]);

  const handleProblemChange = useCallback(
    async (problemId: string) => {
      if (!contest) return;

      const problemIndex = contest.problems.findIndex(
        (p) => p.id === problemId
      );
      if (problemIndex === -1) return;

      try {
        const problemData = await ProblemsService.getProblemById(problemId);
        setCurrentProblem(problemData);
        setCurrentProblemIndex(problemIndex);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    },
    [contest]
  );

  if (loading || !contest || !currentProblem) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-slate-400">Loading contest...</p>
        </div>
      </div>
    );
  }

  // Map contest problems to drawer format
  const drawerProblems = contest.problems.map((p, idx) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    score: p.score,
    status: problemStatuses[p.id]?.status || 'unsolved',
  }));

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Top Bar */}
      <ContestTopBar
        contestName={contest.name}
        problemTitle={`Q${currentProblemIndex + 1}. ${currentProblem.title}`}
        endTime={contest.endTime}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Main Content - Problem Solving Interface */}
      <div className="flex-1 overflow-hidden">
        <ContestProblemWrapper problem={currentProblem} contestMode={true} />
      </div>

      {/* Drawer */}
      <ContestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        contestName={contest.name}
        problems={drawerProblems}
        ranking={MOCK_RANKING}
        currentProblemId={currentProblem.id}
        onProblemClick={handleProblemChange}
      />
    </div>
  );
}
