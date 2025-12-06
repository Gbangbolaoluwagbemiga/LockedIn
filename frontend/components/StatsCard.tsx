'use client';

import { formatCelo } from '@/lib/utils';
import { Trophy, Users, Lock, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | bigint;
  icon: React.ReactNode;
  gradient: string;
}

export function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
  const displayValue =
    typeof value === 'bigint' ? formatCelo(value) : value;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 right-0 h-32 w-32 rounded-full ${gradient} opacity-10 blur-3xl`} />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className={`rounded-lg ${gradient} p-3`}>
            {icon}
          </div>
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
        <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{displayValue}</div>
      </div>
    </div>
  );
}


