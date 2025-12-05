'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContracts } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { LOCKEDIN_ABI, LOCKEDIN_CONTRACT_ADDRESS } from '@/lib/contract';
import { Commitment } from '@/types';
import { useMemo } from 'react';

export function useLockedIn() {
  const { address } = useAccount();

  // Read total reward pool
  const { data: totalRewardPool } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'totalRewardPool',
  });

  // Read total commitments count
  const { data: totalCommitments } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'getTotalCommitments',
  });

  // Get user commitments
  const { data: userCommitmentIds } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'getUserCommitments',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Create commitment
  const { writeContract: createCommitment, data: createHash, isPending: isCreating } = useWriteContract();
  const { isLoading: isConfirmingCreate } = useWaitForTransactionReceipt({ hash: createHash });

  // Mark completed
  const { writeContract: markCompleted, data: completeHash, isPending: isMarking } = useWriteContract();
  const { isLoading: isConfirmingComplete } = useWaitForTransactionReceipt({ hash: completeHash });

  // Unstake
  const { writeContract: unstake, data: unstakeHash, isPending: isUnstaking } = useWriteContract();
  const { isLoading: isConfirmingUnstake } = useWaitForTransactionReceipt({ hash: unstakeHash });

  const handleCreateCommitment = async (goal: string, durationInDays: number, stakeAmount: string) => {
    if (!createCommitment) return;
    
    createCommitment({
      address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOCKEDIN_ABI,
      functionName: 'createCommitment',
      args: [goal, BigInt(durationInDays)],
      value: parseEther(stakeAmount),
    });
  };

  const handleMarkCompleted = async (commitmentId: bigint) => {
    if (!markCompleted) return;
    
    markCompleted({
      address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOCKEDIN_ABI,
      functionName: 'markCompleted',
      args: [commitmentId],
    });
  };

  const handleUnstake = async (commitmentId: bigint) => {
    if (!unstake) return;
    
    unstake({
      address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOCKEDIN_ABI,
      functionName: 'unstake',
      args: [commitmentId],
    });
  };

  return {
    totalRewardPool: totalRewardPool || 0n,
    totalCommitments: totalCommitments || 0n,
    userCommitmentIds: userCommitmentIds || [],
    createCommitment: handleCreateCommitment,
    markCompleted: handleMarkCompleted,
    unstake: handleUnstake,
    isCreating: isCreating || isConfirmingCreate,
    isMarking: isMarking || isConfirmingComplete,
    isUnstaking: isUnstaking || isConfirmingUnstake,
  };
}

export function useCommitment(commitmentId: bigint | undefined) {
  const { data: commitmentData } = useReadContracts({
    contracts: commitmentId !== undefined ? [
      {
        address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOCKEDIN_ABI,
        functionName: 'getCommitment',
        args: [commitmentId],
      },
      {
        address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOCKEDIN_ABI,
        functionName: 'canUnstake',
        args: [commitmentId],
      },
      {
        address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOCKEDIN_ABI,
        functionName: 'getEstimatedReward',
        args: [commitmentId],
      },
    ] : [],
    query: { enabled: commitmentId !== undefined },
  });

  const commitment: Commitment | null = useMemo(() => {
    if (!commitmentData || !commitmentData[0]?.result) return null;
    
    const [commitmentResult, canUnstakeResult, rewardResult] = commitmentData;
    const commitment = commitmentResult.result as any;
    
    if (!commitment) return null;

    return {
      id: commitmentId!,
      user: commitment.user,
      stakeAmount: commitment.stakeAmount,
      goal: commitment.goal,
      deadline: commitment.deadline,
      completed: commitment.completed,
      claimed: commitment.claimed,
      createdAt: commitment.createdAt,
      canUnstake: canUnstakeResult?.result as boolean || false,
      estimatedReward: rewardResult?.result as bigint || 0n,
    };
  }, [commitmentData, commitmentId]);

  return { commitment };
}

