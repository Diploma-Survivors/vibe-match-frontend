'use client';

import ContestDrawer from '@/components/contest/contest-drawer';
import ContestNavbar from '@/components/contest/solve/contest-navbar';
import ContestProblemWrapper from '@/components/problems/tabs/description/contest-problem-wrapper';
import {
  MOCK_CONTEST_DETAIL,
  MOCK_PROBLEM_DESCRIPTION,
  MOCK_RANKING_LIST,
} from '@/data/contest-detail';
import type { ProblemDescription } from '@/types/problems';
import { useMemo, useState } from 'react';

export default function ContestSolvePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentProblemId, setCurrentProblemId] = useState(
    MOCK_CONTEST_DETAIL.problems[0].id
  );

  // Use Mock Data
  const contestData = MOCK_CONTEST_DETAIL;

  // Navigation Logic
  const currentIndex = useMemo(() =>
    contestData.problems.findIndex(p => p.id === currentProblemId),
    [contestData.problems, currentProblemId]);

  const handleNext = () => {
    if (currentIndex < contestData.problems.length - 1) {
      setCurrentProblemId(contestData.problems[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentProblemId(contestData.problems[currentIndex - 1].id);
    }
  };

  // Transform Mock Description
  const currentProblem: ProblemDescription = {
    ...MOCK_PROBLEM_DESCRIPTION,
    id: currentProblemId,
    title:
      contestData.problems.find((p) => p.id === currentProblemId)?.title ||
      MOCK_PROBLEM_DESCRIPTION.title,
  } as unknown as ProblemDescription;

  const handleProblemChange = (problemId: string) => {
    setCurrentProblemId(problemId);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
      {/* 1. Global Header */}
      <ContestNavbar
        onMenuClick={() => setIsDrawerOpen(true)}
        onNextProblem={handleNext}
        onPrevProblem={handlePrev}
        hasNext={currentIndex < contestData.problems.length - 1}
        hasPrev={currentIndex > 0}
      />

      {/* 2. Main Split Layout */}
      <div className="flex-1 overflow-hidden relative">
        <ContestProblemWrapper
          problem={currentProblem}
          contestMode={true}
          onSubmitSuccess={() => {
            console.log('Submitted successfully');
          }}
        />
      </div>

      {/* 3. Contest Drawer (Ranking) */}
      <ContestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        contestName={contestData.title}
        problems={contestData.problems}
        ranking={MOCK_RANKING_LIST}
        currentProblemId={currentProblemId}
        onProblemClick={handleProblemChange}
      />
    </div>
  );
}
