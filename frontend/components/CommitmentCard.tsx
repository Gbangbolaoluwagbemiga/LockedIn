'use client';

import { formatCelo, formatDate, formatAddress } from '@/lib/utils';
import { CountdownTimer } from './CountdownTimer';
import { CheckCircle2, Clock, XCircle, Trophy, Lock } from 'lucide-react';
import { Commitment } from '@/types';

interface CommitmentCardProps {
  commitment: Commitment;
  onMarkComplete?: (id: bigint) => void;
  onUnstake?: (id: bigint) => void;
  isLoading?: boolean;
  isOwner?: boolean;
}

export function CommitmentCard({
  commitment,
  onMarkComplete,
  onUnstake,
  isLoading,
  isOwner,
}: CommitmentCardProps) {
  const canUnstake = commitment.canUnstake;
  const isExpired = Number(commitment.deadline) * 1000 < Date.now();
  const showMarkComplete = isOwner && !commitment.completed && !isExpired;
  const showUnstake = isOwner && canUnstake && !commitment.claimed;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {commitment.completed ? (
          <div className="flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        ) : isExpired ? (
          <div className="flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            Expired
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Clock className="h-3 w-3" />
            Active
          </div>
        )}
      </div>

      {/* Goal */}
      <h3 className="mb-4 pr-20 text-xl font-bold text-gray-900 dark:text-white">
        {commitment.goal}
      </h3>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">Stake Amount</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCelo(commitment.stakeAmount)} CELO
          </div>
        </div>
        {commitment.estimatedReward > 0n && (
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Est. Reward</div>
            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
              {formatCelo(commitment.estimatedReward)} CELO
            </div>
          </div>
        )}
      </div>

      {/* Countdown or Deadline */}
      {!isExpired && !commitment.completed ? (
        <div className="mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
          <div className="mb-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            Time Remaining
          </div>
          <CountdownTimer deadline={commitment.deadline} />
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Deadline: {formatDate(commitment.deadline)}
        </div>
      )}

      {/* User Address */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Lock className="h-4 w-4" />
        <span>{formatAddress(commitment.user)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {showMarkComplete && (
          <button
            onClick={() => onMarkComplete?.(commitment.id)}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle2 className="mr-2 inline h-4 w-4" />
            Mark Complete
          </button>
        )}
        {showUnstake && (
          <button
            onClick={() => onUnstake?.(commitment.id)}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
          >
            <Trophy className="mr-2 inline h-4 w-4" />
            Unstake & Claim
          </button>
        )}
      </div>
    </div>
  );
}

