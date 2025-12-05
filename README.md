# 🔒 LockedIn - Commitment Contract Platform

A decentralized commitment contract platform built on Ethereum. Lock in your goals by staking ETH, and earn rewards from those who fail to complete their commitments.

## 🎯 Features

- **Stake Commitments**: Lock ETH while committing to a goal
- **Unstake**: Withdraw your stake (with penalties if goal not completed)
- **Reward Distribution**: Successful participants earn from failed commitments
- **Time-Locked Goals**: Set commitment periods (e.g., 30 days)
- **Transparent & Trustless**: All commitments are on-chain

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Hardhat

### Installation

```bash
npm install
```

### Compile

```bash
npx hardhat compile
```

### Test

```bash
npx hardhat test
```

### Deploy

```bash
npx hardhat run scripts/deploy.js --network <network>
```

## 📝 How It Works

1. **Create Commitment**: Stake ETH and set your goal with a deadline
2. **Complete Goal**: If you complete your commitment, you can unstake and claim rewards
3. **Fail Goal**: If you fail, your stake goes to the reward pool
4. **Earn Rewards**: Successful participants share the reward pool

## 🛠️ Tech Stack

- Solidity ^0.8.0
- Hardhat
- Ethers.js

## 🚀 Deploying to GitHub

1. Create a new repository on GitHub named `LockedIn`
2. Run the setup script:
   ```powershell
   .\scripts\setup-github.ps1
   ```
   Or manually:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/LockedIn.git
   git branch -M main
   git push -u origin main
   ```

## 📄 License

MIT

