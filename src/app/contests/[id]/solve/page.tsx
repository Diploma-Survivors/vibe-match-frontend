'use client';

import ContestDrawer from '@/components/contest/contest-drawer';
import ContestTopBar from '@/components/contest/contest-topbar';
import ContestProblemWrapper from '@/components/problems/tabs/description/contest-problem-wrapper';
import SubmissionsPage from '@/components/problems/tabs/submissions/submissions-page';
import { useDialog } from '@/components/providers/dialog-provider';
import { useToast } from '@/components/providers/toast-provider';
import { ContestsService } from '@/services/contests-service';
import { ProblemsService } from '@/services/problems-service';
import { toastService } from '@/services/toasts-service';
import { setContest } from '@/store/slides/contest-slice';
import { type Contest, ContestNavTabs } from '@/types/contests';
import type { ProblemDescription } from '@/types/problems';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const { confirm, alert } = useDialog();

  const [contestData, setContestData] = useState<Contest | null>(null);
  const [currentProblem, setCurrentProblem] =
    useState<ProblemDescription | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<ContestNavTabs>(
    ContestNavTabs.DESCRIPTION
  );

  // Fetch contest data
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setLoading(true);
        const response = await ContestsService.getContestDetail(contestId);
        const contestData = response?.data?.data as Contest;
        setContestData(contestData);
        dispatch(setContest(contestData));

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
  }, [contestId, dispatch]);

  const handleProblemChange = useCallback(
    async (problemId: string) => {
      if (!contestData) return;

      const problemIndex = contestData.problems.findIndex(
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
    [contestData]
  );

  const handleTabChange = (tab: ContestNavTabs) => {
    setActiveTab(tab);
  };

  const handleEndContest = useCallback(async () => {
    try {
      const result = await confirm({
        title: 'Kết thúc',
        message: 'Bạn có muốn nộp bài và kết thúc không?',
        confirmText: 'Kết thúc',
        cancelText: 'Hủy',
        color: 'red',
      });
      if (!result) return;

      await ContestsService.finishContest(contestId);
      await alert({
        title: 'Đã kết thúc',
        message: 'Cuộc thi đã được kết thúc thành công.',
        buttonText: 'OK',
        color: 'green',
      });

      window.location.reload();
    } catch (error) {}
  }, [contestId, confirm, alert]);

  if (loading || !contestData || !currentProblem) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-slate-400">Loading contest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Top Bar */}
      <ContestTopBar
        onEndContest={handleEndContest}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Main Content - Problem Solving Interface */}
      <div className="flex-1 overflow-hidden">
        {activeTab === ContestNavTabs.DESCRIPTION ? (
          <ContestProblemWrapper problem={currentProblem} contestMode={true} />
        ) : (
          <SubmissionsPage
            problemId={currentProblem.id}
            contestParticipationId={contestData.participation?.participationId}
          />
        )}
      </div>

      {/* Drawer */}
      <ContestDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        contestName={contestData.name}
        problems={contestData.problems}
        ranking={MOCK_RANKING}
        currentProblemId={currentProblem.id}
        onProblemClick={handleProblemChange}
      />
    </div>
  );
}
