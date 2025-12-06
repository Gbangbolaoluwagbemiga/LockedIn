'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContracts } from 'wagmi';
import { parseEther } from 'viem';
import { LOCKEDIN_ABI, LOCKEDIN_CONTRACT_ADDRESS } from '@/lib/contract';
import { Commitment } from '@/types';
import { useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useLockedIn() {
  const { address, chain } = useAccount();

  // Read paused state
  const { data: isPaused } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'paused',
  });

  // Read total reward pool
  const { data: totalRewardPool, refetch: refetchRewardPool } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'totalRewardPool',
  });

  // Read total commitments count
  const { data: totalCommitments, refetch: refetchTotalCommitments } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'getTotalCommitments',
  });

  // Get user commitments
  const { data: userCommitmentIds, refetch: refetchUserCommitments } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'getUserCommitments',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Create commitment
  const { writeContract: createCommitment, data: createHash, isPending: isCreating, error: createError } = useWriteContract();
  const { isLoading: isConfirmingCreate, isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({ hash: createHash });

  // Log errors
  useEffect(() => {
    if (createError) {
      console.error('Create commitment error:', createError);
      toast.error('Transaction failed: ' + createError.message);
    }
  }, [createError]);

  // Success notification for create
  useEffect(() => {
    if (isCreateSuccess) {
      toast.success('🎉 Commitment created successfully!');
      // Refetch all data
      refetchRewardPool();
      refetchTotalCommitments();
      refetchUserCommitments();
    }
  }, [isCreateSuccess, refetchRewardPool, refetchTotalCommitments, refetchUserCommitments]);

  // Mark completed
  const { writeContract: markCompleted, data: completeHash, isPending: isMarking } = useWriteContract();
  const { isLoading: isConfirmingComplete, isSuccess: isCompleteSuccess } = useWaitForTransactionReceipt({ hash: completeHash });

  // Success notification for mark complete
  useEffect(() => {
    if (isCompleteSuccess) {
      toast.success('✅ Commitment marked as complete!');
      // Refetch user commitments after a brief delay
      setTimeout(() => {
        refetchUserCommitments();
      }, 2000);
    }
  }, [isCompleteSuccess, refetchUserCommitments]);

  // Unstake
  const { writeContract: unstake, data: unstakeHash, isPending: isUnstaking } = useWriteContract();
  const { isLoading: isConfirmingUnstake, isSuccess: isUnstakeSuccess } = useWaitForTransactionReceipt({ hash: unstakeHash });

  // Success notification for unstake
  useEffect(() => {
    if (isUnstakeSuccess) {
      toast.success('💰 Funds unstaked successfully!');
      // Refetch all data after a brief delay
      setTimeout(() => {
        refetchRewardPool();
        refetchUserCommitments();
      }, 2000);
    }
  }, [isUnstakeSuccess, refetchRewardPool, refetchUserCommitments]);

  const handleCreateCommitment = async (goal: string, durationInDays: number, stakeAmount: string) => {
    if (!createCommitment) {
      console.error('createCommitment function not available');
      toast.error('Wallet connection error. Please refresh and try again.');
      return;
    }

    if (!address) {
      console.error('No wallet address connected');
      toast.error('Please connect your wallet first');
      return;
    }

    if (!chain) {
      console.error('No chain detected');
      toast.error('Please make sure your wallet is connected to Celo Mainnet');
      return;
    }

    if (chain.id !== 42220) {
      console.error('Wrong network. Current chain ID:', chain.id);
      toast.error(`Please switch to Celo Mainnet. Currently on wrong network.`);
      return;
    }
    
    try {
      console.log('Creating commitment:', { goal, durationInDays, stakeAmount });
      console.log('Contract address:', LOCKEDIN_CONTRACT_ADDRESS);
      console.log('Connected address:', address);
      console.log('Chain:', chain);
      
      createCommitment({
        address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
        abi: LOCKEDIN_ABI,
        functionName: 'createCommitment',
        args: [goal, BigInt(durationInDays)],
        value: parseEther(stakeAmount),
        gas: BigInt(300000), // Add explicit gas limit
      }, {
        onSuccess: (hash) => {
          console.log('Transaction sent! Hash:', hash);
          toast.success('Transaction sent! Waiting for confirmation...');
        },
        onError: (error) => {
          console.error('Transaction error:', error);
          toast.error('Transaction failed: ' + error.message);
        },
      });
      
      console.log('WriteContract called');
    } catch (error) {
      console.error('Error creating commitment:', error);
      toast.error('Transaction failed: ' + (error as Error).message);
      throw error;
    }
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
    isPaused: isPaused || false,
    totalRewardPool: totalRewardPool || 0n,
    totalCommitments: totalCommitments || 0n,
    userCommitmentIds: userCommitmentIds || [],
    createCommitment: handleCreateCommitment,
    markCompleted: handleMarkCompleted,
    unstake: handleUnstake,
    isCreating: isCreating || isConfirmingCreate,
    isMarking: isMarking || isConfirmingComplete,
    isUnstaking: isUnstaking || isConfirmingUnstake,
    createHash,
  };
}

export function useCommitment(commitmentId: bigint | undefined) {
  const { data: commitmentData, refetch } = useReadContracts({
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
    if (!commitmentData || commitmentData.length < 3 || !commitmentData[0]?.result) return null;
    
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
      canUnstake: (canUnstakeResult?.result as boolean) || false,
      estimatedReward: (rewardResult?.result as bigint) || 0n,
    };
  }, [commitmentData, commitmentId]);

  return { commitment };
}
