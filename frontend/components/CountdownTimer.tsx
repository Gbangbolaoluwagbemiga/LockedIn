'use client';

import { useEffect, useState } from 'react';
import { getTimeRemaining } from '@/lib/utils';

interface CountdownTimerProps {
  deadline: bigint;
  className?: string;
}

export function CountdownTimer({ deadline, className }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (time.isExpired) {
    return (
      <div className={className}>
        <span className="text-red-500 font-semibold">Expired</span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {time.days > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{time.days}</span>
          <span className="text-xs text-gray-500">days</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{time.hours}</span>
        <span className="text-xs text-gray-500">hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{time.minutes}</span>
        <span className="text-xs text-gray-500">min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{time.seconds}</span>
        <span className="text-xs text-gray-500">sec</span>
      </div>
    </div>
  );
}

