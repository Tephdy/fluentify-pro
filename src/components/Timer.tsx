// src/components/Timer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export default function Timer({ initialMinutes, onTimeUp, isActive }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="flex items-center gap-2 bg-slate-100 text-slate-800 font-mono px-4 py-2 rounded-lg text-sm border border-slate-300">
      <TimerIcon className="w-4 h-4 text-indigo-600" />
      <span>
        {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
      </span>
    </div>
  );
}