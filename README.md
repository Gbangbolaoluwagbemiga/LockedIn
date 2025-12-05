# 🔒 LockedIn - Commitment Contract Platform

A decentralized commitment contract platform built on **Celo**. Lock in your goals by staking CELO, and earn rewards from those who fail to complete their commitments.

## 🎯 Features

- **Stake Commitments**: Lock CELO while committing to a goal
- **Unstake**: Withdraw your stake (with penalties if goal not completed)
- **Reward Distribution**: Successful participants earn from failed commitments
- **Time-Locked Goals**: Set commitment periods (e.g., 30 days)
- **Transparent & Trustless**: All commitments are on-chain
- **Built on Celo**: Fast, low-cost transactions on the Celo blockchain

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Hardhat

### Installation

```bash
npm install
```

### Environment Setup

1. Create a `.env` file in the root directory:
```bash
PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here  # Optional, for contract verification
```

2. **Get Testnet CELO** (for Alfajores):
   - Visit: https://faucet.celo.org/alfajores
   - Connect your wallet and request testnet CELO

### Compile

```bash
npm run compile
```

### Test

```bash
npm run test
```

### Deploy to Celo

#### Deploy to Alfajores Testnet

```bash
npm run deploy:alfajores
```

#### Deploy to Celo Mainnet

```bash
npm run deploy:celo
```

#### Deploy to Local Network

```bash
npm run deploy
```

## 📝 How It Works

1. **Create Commitment**: Stake CELO and set your goal with a deadline
2. **Complete Goal**: If you complete your commitment, you can unstake and claim rewards
3. **Fail Goal**: If you fail, your stake goes to the reward pool
4. **Earn Rewards**: Successful participants share the reward pool

## 🌐 Celo Networks

- **Alfajores Testnet**: Chain ID `44787` - For testing
  - Explorer: https://alfajores.celoscan.io
  - Faucet: https://faucet.celo.org/alfajores
  
- **Celo Mainnet**: Chain ID `42220` - Production
  - Explorer: https://celoscan.io

## 🛠️ Tech Stack

- Solidity ^0.8.20
- Hardhat
- Ethers.js
- Celo Blockchain
- dotenv (for environment variables)

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

