'use client';

import { Header } from '@/components/Header';
import { CommitmentCard } from '@/components/CommitmentCard';
import { CreateCommitmentModal } from '@/components/CreateCommitmentModal';
import { useLockedIn, useCommitment } from '@/hooks/useLockedIn';
import { useAccount } from 'wagmi';
import { Plus, Lock } from 'lucide-react';
import { useState } from 'react';

export default function MyCommitmentsPage() {
  const { address } = useAccount();
  const {
    userCommitmentIds,
    createCommitment,
    markCompleted,
    unstake,
    isCreating,
    isMarking,
    isUnstaking,
  } = useLockedIn();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (goal: string, duration: number, stake: string) => {
    await createCommitment(goal, duration, stake);
    setIsModalOpen(false);
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view your commitments
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Commitments</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            New Commitment
          </button>
        </div>

        {userCommitmentIds.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No Commitments Yet
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Create your first commitment to start locking in your goals!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
            >
              Create Commitment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userCommitmentIds.map((id) => (
              <CommitmentCardWrapper
                key={id.toString()}
                commitmentId={id}
                onMarkComplete={markCompleted}
                onUnstake={unstake}
                isLoading={isMarking || isUnstaking}
              />
            ))}
          </div>
        )}
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
  onMarkComplete,
  onUnstake,
  isLoading,
}: {
  commitmentId: bigint;
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
      isOwner={true}
    />
  );
}

