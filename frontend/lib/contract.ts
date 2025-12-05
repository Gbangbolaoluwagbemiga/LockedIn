export const LOCKEDIN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const LOCKEDIN_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_goal', type: 'string' },
      { internalType: 'uint256', name: '_durationInDays', type: 'uint256' },
    ],
    name: 'createCommitment',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_commitmentId', type: 'uint256' }],
    name: 'markCompleted',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_commitmentId', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_commitmentId', type: 'uint256' }],
    name: 'getCommitment',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'user', type: 'address' },
          { internalType: 'uint256', name: 'stakeAmount', type: 'uint256' },
          { internalType: 'string', name: 'goal', type: 'string' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bool', name: 'completed', type: 'bool' },
          { internalType: 'bool', name: 'claimed', type: 'bool' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
        ],
        internalType: 'struct LockedIn.Commitment',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getUserCommitments',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalCommitments',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_commitmentId', type: 'uint256' }],
    name: 'canUnstake',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_commitmentId', type: 'uint256' }],
    name: 'getEstimatedReward',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalRewardPool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

