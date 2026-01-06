'use client';

import { LeaderboardTable } from '@/components/contest/ranking/leaderboard-table';
import { TopSolvers } from '@/components/contest/ranking/top-solvers';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ContestRankingPage() {
  const { t } = useTranslation('ranking');
  const params = useParams();
  const contestId = params.id as string;

  if (!contestId) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            {t('ranking_title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('ranking_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Podium Panel */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <TopSolvers contestId={contestId} />
          </div>

          {/* Leaderboard Panel */}
          <div className="lg:col-span-7 xl:col-span-8">
            <LeaderboardTable contestId={contestId} />
          </div>
        </div>
      </div>
    </div>
  );
}
