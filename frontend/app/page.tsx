'use client';

import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { CommitmentCard } from '@/components/CommitmentCard';
import { CreateCommitmentModal } from '@/components/CreateCommitmentModal';
import { useLockedIn, useCommitment } from '@/hooks/useLockedIn';
import { useAccount } from 'wagmi';
import { Plus, Trophy, Users, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCelo } from '@/lib/utils';

export default function Home() {
  const { address } = useAccount();
  const {
    totalRewardPool,
    totalCommitments,
    createCommitment,
    markCompleted,
    unstake,
    isCreating,
    isMarking,
    isUnstaking,
  } = useLockedIn();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commitments, setCommitments] = useState<bigint[]>([]);

  // Fetch all commitment IDs
  useEffect(() => {
    const fetchCommitments = async () => {
      if (totalCommitments) {
        const ids: bigint[] = [];
        for (let i = 0; i < Number(totalCommitments); i++) {
          ids.push(BigInt(i));
        }
        setCommitments(ids);
      }
    };
    fetchCommitments();
  }, [totalCommitments]);

  const handleCreate = async (goal: string, duration: number, stake: string) => {
    await createCommitment(goal, duration, stake);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent">
            Lock In Your Goals
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Stake CELO to commit to your goals. Complete them to earn rewards from those who fail.
            Built on Celo for fast, low-cost transactions.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Reward Pool"
            value={totalRewardPool}
            icon={<Trophy className="h-6 w-6 text-white" />}
            gradient="from-yellow-500 to-orange-500"
          />
          <StatsCard
            title="Total Commitments"
            value={totalCommitments.toString()}
            icon={<Users className="h-6 w-6 text-white" />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Platform Status"
            value="Active"
            icon={<Lock className="h-6 w-6 text-white" />}
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Create Button */}
        {address && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Create New Commitment
            </button>
          </div>
        )}

        {/* Commitments Grid */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            All Commitments
          </h2>
          {commitments.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
              <Lock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No commitments yet. Be the first to lock in your goal!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {commitments.map((id) => (
                <CommitmentCardWrapper
                  key={id.toString()}
                  commitmentId={id}
                  address={address}
                  onMarkComplete={markCompleted}
                  onUnstake={unstake}
                  isLoading={isMarking || isUnstaking}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateCommitmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        isLoading={isCreating}
      />
    </div>
  );
}

function CommitmentCardWrapper({
  commitmentId,
  address,
  onMarkComplete,
  onUnstake,
  isLoading,
}: {
  commitmentId: bigint;
  address: string | undefined;
  onMarkComplete: (id: bigint) => void;
  onUnstake: (id: bigint) => void;
  isLoading: boolean;
}) {
  const { commitment } = useCommitment(commitmentId);

  if (!commitment) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  return (
    <CommitmentCard
      commitment={commitment}
      onMarkComplete={onMarkComplete}
      onUnstake={onUnstake}
      isLoading={isLoading}
      isOwner={commitment.user.toLowerCase() === address?.toLowerCase()}
    />
  );
}
