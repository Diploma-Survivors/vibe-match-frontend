'use client';

import Timeline from '@/components/contest/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MOCK_CONTEST_DETAIL,
} from '@/data/contest-detail';
import {
  CONTEST_SUBMISSION_STRATEGY_DESCRIPTION,
  ContestStatus,
  ContestSubmissionStrategy,
} from '@/types/contests';
import { getDifficultyColor } from '@/types/problems';
import { CheckCircle, Clock, FileText, Play, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ContestInfoPage() {
  const router = useRouter();
  const { t } = useTranslation('contests');

  // Use Mock Data
  const contest = MOCK_CONTEST_DETAIL;
  const userRank = contest.userRank;

  // Computed status (Mocked as ONGOING in data)
  const contestStatus = ContestStatus.ONGOING;

  const handleStart = () => {
    router.push(`/contests/${contest.id}/solve`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 gap-8">

        {/* Hero Card */}
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden relative">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="p-8 relative z-10 text-center space-y-6">
            <div className="inline-flex">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 gap-2 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t(contestStatus)}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {contest.title}
            </h1>

            <div className="flex justify-center w-full max-w-2xl mx-auto items-center text-muted-foreground gap-8 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{t('duration')}: 90 {t('minutes', { defaultValue: 'mins' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>{t('prize_pool')}: {t('none', { defaultValue: 'None' })}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="max-w-3xl mx-auto pt-4">
              <Timeline
                timelineEvents={[
                  { id: 'start', name: t('start_time'), timestamp: contest.startTime },
                  { id: 'end', name: t('end_time'), timestamp: contest.endTime },
                ]}
              />
            </div>

            <div className="pt-6">
              <Button
                size="lg"
                onClick={handleStart}
                className="px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                <Play className="w-4 h-4 mr-2" />
                {t('join_contest')}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rules */}
          <div className="md:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t('contest_rules')}
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                {t('contest_rules_desc')}
              </p>
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <strong className="block text-foreground mb-1">{t('submission_policy')}</strong>
                {CONTEST_SUBMISSION_STRATEGY_DESCRIPTION[ContestSubmissionStrategy.SINGLE_SUBMISSION]}
                <span className="opacity-50"> {t('mock_unlimited')}</span>
              </div>
            </div>
          </div>

          {/* My Performance (Mock) */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {t('your_rank')}
            </h3>
            {userRank ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-muted-foreground text-sm">{t('rank')}</span>
                  <span className="text-2xl font-bold">{userRank.rank}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-muted-foreground text-sm">{t('score')}</span>
                  <span className="text-xl font-semibold text-primary">{userRank.score}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-muted-foreground text-sm">{t('solved')}</span>
                  <span className="text-base font-medium">{userRank.solvedProblems} / {contest.problems.length}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                {t('join_contest')}
              </div>
            )}
          </div>
        </div>

        {/* Problem List Preview */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold">{t('problems')}</h3>
          </div>
          <div className="divide-y divide-border">
            {contest.problems.map((problem, idx) => (
              <div key={problem.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-foreground">{problem.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getDifficultyColor(problem.difficulty)} text-[10px] h-5`}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {problem.maxScore} {t('points')}
                      </span>
                    </div>
                  </div>
                </div>
                {problem.status === 'SOLVED' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
