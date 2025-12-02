'use client';

import type { ProblemDescription as ProblemDetailType } from '@/types/problems';
import React from 'react';
import ContestProblemWrapper from './contest-problem-wrapper';

interface ProblemDescriptionProps {
  problem: ProblemDetailType;
}

export default function ProblemDescription({
  problem,
}: ProblemDescriptionProps) {
  return <ContestProblemWrapper problem={problem} contestMode={false} />;
}
