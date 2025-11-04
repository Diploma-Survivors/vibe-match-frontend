'use client';

import { useEffect, useState } from 'react';

interface ContestTimerProps {
  endTime: string;
}

export default function ContestTimer({ endTime }: ContestTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setTimeLeft(formatted);

      // Warning when less than 30 minutes
      setIsWarning(difference < 30 * 60 * 1000);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div
      className={`font-mono text-lg font-semibold ${
        isWarning
          ? 'text-red-600 dark:text-red-400'
          : 'text-slate-700 dark:text-slate-300'
      }`}
    >
      {timeLeft}
    </div>
  );
}
