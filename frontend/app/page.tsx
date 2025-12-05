"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import { parseEther, formatEther } from "viem";

const CONTRACT_ADDRESS = "0xdECA90a8476F69277E593deC1c4b6C78e9891d82" as const;

const LOCKEDIN_ABI = [
  {
    inputs: [
      { name: "_goal", type: "string" },
      { name: "_durationInDays", type: "uint256" },
    ],
    name: "createCommitment",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "_commitmentId", type: "uint256" }],
    name: "markCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_commitmentId", type: "uint256" }],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_commitmentId", type: "uint256" }],
    name: "getCommitment",
    outputs: [
      {
        components: [
          { name: "user", type: "address" },
          { name: "stakeAmount", type: "uint256" },
          { name: "goal", type: "string" },
          { name: "deadline", type: "uint256" },
          { name: "completed", type: "bool" },
          { name: "claimed", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getUserCommitments",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalCommitments",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRewardPool",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [stakeAmount, setStakeAmount] = useState("0.1");

  const { data: totalCommitments } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOCKEDIN_ABI,
    functionName: "getTotalCommitments",
  });

  const { data: rewardPool } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOCKEDIN_ABI,
    functionName: "totalRewardPool",
  });

  const { data: userCommitments } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOCKEDIN_ABI,
    functionName: "getUserCommitments",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const handleCreateCommitment = async () => {
    if (!goal || !duration || !stakeAmount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOCKEDIN_ABI,
        functionName: "createCommitment",
        args: [goal, BigInt(duration)],
        value: parseEther(stakeAmount),
      });
    } catch (error) {
      console.error("Error creating commitment:", error);
      alert("Failed to create commitment");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              🔒 LockedIn
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Lock in your goals by staking CELO on Celo blockchain
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Connect Wallet
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isConnected
                    ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                    : "Connect your wallet to get started"}
                </p>
              </div>
              <w3m-button />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Total Commitments
              </h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {totalCommitments?.toString() || "0"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Reward Pool
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {rewardPool ? formatEther(rewardPool) : "0"} CELO
              </p>
            </div>
          </div>

          {/* Create Commitment */}
          {isConnected && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Create New Commitment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Goal
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., I will not buy coffee for 30 days"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stake Amount (CELO)
                    </label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      min="0.001"
                      step="0.001"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreateCommitment}
                  disabled={isPending || isConfirming}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? "Confirm in wallet..."
                    : isConfirming
                    ? "Creating commitment..."
                    : "Create Commitment"}
                </button>
                {isConfirmed && (
                  <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p className="text-green-800 dark:text-green-200">
                      ✅ Commitment created successfully!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Commitments */}
          {isConnected && userCommitments && userCommitments.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Commitments
              </h2>
              <div className="space-y-4">
                {userCommitments.map((id) => (
                  <CommitmentCard key={id.toString()} commitmentId={id} />
                ))}
              </div>
            </div>
          )}

          {/* Contract Info */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Contract Address: {CONTRACT_ADDRESS}</p>
            <a
              href={`https://celoscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View on CeloScan
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function CommitmentCard({ commitmentId }: { commitmentId: bigint }) {
  const { address } = useAccount();
  const { data: commitment } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOCKEDIN_ABI,
    functionName: "getCommitment",
    args: [commitmentId],
  });

  const { writeContract: markCompleted, isPending: isMarking } = useWriteContract();
  const { writeContract: unstake, isPending: isUnstaking } = useWriteContract();

  if (!commitment) return null;

  const deadline = new Date(Number(commitment.deadline) * 1000);
  const isExpired = deadline < new Date();
  const canUnstake = isExpired && !commitment.claimed;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
        {commitment.goal}
      </h3>
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>Stake: {formatEther(commitment.stakeAmount)} CELO</p>
        <p>Deadline: {deadline.toLocaleDateString()}</p>
        <p>Status: {commitment.completed ? "✅ Completed" : "⏳ In Progress"}</p>
        {commitment.claimed && <p>💰 Claimed</p>}
      </div>
      <div className="mt-4 flex gap-2">
        {!commitment.completed && !isExpired && (
          <button
            onClick={() =>
              markCompleted({
                address: CONTRACT_ADDRESS,
                abi: LOCKEDIN_ABI,
                functionName: "markCompleted",
                args: [commitmentId],
              })
            }
            disabled={isMarking}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
          >
            Mark Completed
          </button>
        )}
        {canUnstake && (
          <button
            onClick={() =>
              unstake({
                address: CONTRACT_ADDRESS,
                abi: LOCKEDIN_ABI,
                functionName: "unstake",
                args: [commitmentId],
              })
            }
            disabled={isUnstaking}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm disabled:opacity-50"
          >
            Unstake
          </button>
        )}
      </div>
    </div>
  );
}

