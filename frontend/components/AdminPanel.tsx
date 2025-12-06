'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { LOCKEDIN_ABI, LOCKEDIN_CONTRACT_ADDRESS } from '@/lib/contract';
import { Shield, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export function AdminPanel() {
  const { address } = useAccount();

  // Read contract owner
  const { data: owner } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'owner',
  });

  // Read paused state
  const { data: isPaused, refetch: refetchPaused } = useReadContract({
    address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOCKEDIN_ABI,
    functionName: 'paused',
  });

  // Pause contract
  const { writeContract: pauseContract, data: pauseHash, isPending: isPausing } = useWriteContract();
  const { isSuccess: isPauseSuccess } = useWaitForTransactionReceipt({ hash: pauseHash });

  // Unpause contract
  const { writeContract: unpauseContract, data: unpauseHash, isPending: isUnpausing } = useWriteContract();
  const { isSuccess: isUnpauseSuccess } = useWaitForTransactionReceipt({ hash: unpauseHash });

  // Success handlers
  useEffect(() => {
    if (isPauseSuccess) {
      toast.success('⏸️ Contract paused successfully');
      setTimeout(() => refetchPaused(), 2000);
    }
  }, [isPauseSuccess, refetchPaused]);

  useEffect(() => {
    if (isUnpauseSuccess) {
      toast.success('▶️ Contract unpaused successfully');
      setTimeout(() => refetchPaused(), 2000);
    }
  }, [isUnpauseSuccess, refetchPaused]);

  const handlePause = () => {
    pauseContract({
      address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOCKEDIN_ABI,
      functionName: 'pause',
      gas: BigInt(100000),
    });
  };

  const handleUnpause = () => {
    unpauseContract({
      address: LOCKEDIN_CONTRACT_ADDRESS as `0x${string}`,
      abi: LOCKEDIN_ABI,
      functionName: 'unpause',
      gas: BigInt(100000),
    });
  };

  // Only show if user is the owner
  if (!address || !owner || address.toLowerCase() !== (owner as string).toLowerCase()) {
    return null;
  }

  return (
    <div className="mb-8 rounded-2xl border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Contract management controls</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white dark:bg-gray-900 px-4 py-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Contract Status</div>
            <div className="flex items-center gap-2">
              {isPaused ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">PAUSED</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">ACTIVE</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {isPaused ? (
            <button
              onClick={handleUnpause}
              disabled={isUnpausing}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUnpausing ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unpausing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Unpause Contract
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handlePause}
              disabled={isPausing}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPausing ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pausing...
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Contract
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          ⚠️ When paused, users cannot create commitments, mark complete, or unstake. Use for emergencies only.
        </p>
      </div>
    </div>
  );
}

