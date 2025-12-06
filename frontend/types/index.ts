export interface Commitment {
  id: bigint;
  user: string;
  stakeAmount: bigint;
  goal: string;
  deadline: bigint;
  completed: boolean;
  claimed: boolean;
  createdAt: bigint;
  canUnstake: boolean;
  estimatedReward: bigint;
}


