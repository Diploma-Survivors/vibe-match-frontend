'use client';

import { toastService } from '@/services/toasts-service';
import { selectContest } from '@/store/slides/contest-slice';
import { ContestDeadlineEnforcement } from '@/types/contests';
import { use, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ContestTimer() {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isWarning, setIsWarning] = useState(false);
  const [isOverTime, setIsOverTime] = useState(false);
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    if (isOverTime) {
      toastService.error('Thời gian đã hết.');
      window.location.reload();
    }
  }, [isOverTime]);

  const contest = useSelector(selectContest);
  const calculateTimeLeft = useCallback(() => {
    const contestEndTime = new Date(contest.endTime).getTime();
    const now = new Date().getTime();

    const lateDeadline = contest.lateDeadline
      ? new Date(contest.lateDeadline).getTime()
      : undefined;
    const startTime = contest.participation?.startTime
      ? new Date(contest.participation.startTime).getTime()
      : undefined;
    let endTime = contestEndTime;

    if (contest.durationMinutes) {
      if (
        contest.deadlineEnforcement === ContestDeadlineEnforcement.FLEXIBLE &&
        startTime
      ) {
        endTime = startTime + contest.durationMinutes * 60 * 1000;
      }
    }

    if (now > endTime) {
      if (lateDeadline && now < lateDeadline) {
        endTime = lateDeadline;
        setIsLate(true);
      } else {
        setIsOverTime(true);
        return;
      }
    }

    const difference = endTime - now;

    // Breakdown: days, hours, minutes, seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    let formatted = '';

    if (days > 0) {
      formatted += `${days}D `;
    }

    formatted += `${String(hours).padStart(2, '0')}:`;
    formatted += `${String(minutes).padStart(2, '0')}:`;
    formatted += `${String(seconds).padStart(2, '0')}`;

    setTimeLeft(formatted);

    // Show warning when less than 30 minutes remaining
    setIsWarning(difference < 30 * 60 * 1000);
  }, [
    contest.endTime,
    contest.durationMinutes,
    contest.lateDeadline,
    contest.participation?.startTime,
    contest.deadlineEnforcement,
  ]);

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return (
    <div className="flex flex-row gap-2">
      <div
        className={`font-mono text-lg font-semibold ${
          isWarning
            ? 'text-red-600 dark:text-red-400'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {timeLeft}
      </div>

      {isLate && (
        <span className="text-sm text-orange-500 dark:text-orange-400 mt-1">
          (Trong thời gian gia hạn)
        </span>
      )}
    </div>
  );
}
