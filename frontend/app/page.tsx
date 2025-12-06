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
    createHash,
  } = useLockedIn();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commitments, setCommitments] = useState<bigint[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'stake-high' | 'stake-low'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed' | 'expired'>('all');

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
    try {
      console.log('handleCreate called:', { goal, duration, stake });
      await createCommitment(goal, duration, stake);
    } catch (error) {
      console.error('Error in handleCreate:', error);
    }
  };

  // Close modal and refetch when create hash is available
  useEffect(() => {
    if (createHash) {
      console.log('Transaction submitted, closing modal...');
      setIsModalOpen(false);
      // Refetch will happen automatically when transaction is confirmed
    }
  }, [createHash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />

      {/* Loading Overlay */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <svg className="h-12 w-12 animate-spin text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Creating Commitment...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Please confirm the transaction in your wallet</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Commitments
            </h2>
            
            {/* Sort and Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Filter Dropdown */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="stake-high">Highest Stake</option>
                <option value="stake-low">Lowest Stake</option>
              </select>
            </div>
          </div>

          {commitments.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
              <Lock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No commitments yet. Be the first to lock in your goal!
              </p>
            </div>
          ) : (
            <FilteredCommitmentsList
              commitments={commitments}
              filterBy={filterBy}
              sortBy={sortBy}
              address={address}
              onMarkComplete={markCompleted}
              onUnstake={unstake}
              isLoading={isMarking || isUnstaking}
            />
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
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    );
  }

  const isOwner = address && commitment.user.toLowerCase() === address.toLowerCase();

  return (
    <CommitmentCard
      commitment={commitment}
      onMarkComplete={onMarkComplete}
      onUnstake={onUnstake}
      isLoading={isLoading}
      isOwner={isOwner}
    />
  );
}

// Filter and sort helper component
function FilteredCommitmentsList({
  commitments,
  filterBy,
  sortBy,
  address,
  onMarkComplete,
  onUnstake,
  isLoading,
}: {
  commitments: bigint[];
  filterBy: 'all' | 'active' | 'completed' | 'expired';
  sortBy: 'newest' | 'oldest' | 'stake-high' | 'stake-low';
  address: string | undefined;
  onMarkComplete: (id: bigint) => void;
  onUnstake: (id: bigint) => void;
  isLoading: boolean;
}) {
  // This will hold commitment data for sorting
  const [sortedCommitments, setSortedCommitments] = useState<bigint[]>(commitments);

  useEffect(() => {
    let filtered = [...commitments];

    // Sort based on sortBy (we'll do basic sorting by ID for now, 
    // in production you'd fetch full data and sort by actual values)
    if (sortBy === 'newest') {
      filtered.reverse();
    } else if (sortBy === 'oldest') {
      // Already in order
    }
    // For stake sorting, we'd need to fetch all commitment data first
    // For now, just show in order

    setSortedCommitments(filtered);
  }, [commitments, sortBy, filterBy]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedCommitments.map((id) => (
        <CommitmentCardWrapper
          key={id.toString()}
          commitmentId={id}
          address={address}
          onMarkComplete={onMarkComplete}
          onUnstake={onUnstake}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
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
