# LockedIn Frontend

Next.js frontend for the LockedIn commitment contract platform on Celo.

## Features

- 🔗 Reown (WalletConnect) wallet connection
- 📱 Responsive design with Tailwind CSS
- 🔒 Create commitments by staking CELO
- ✅ Mark commitments as completed
- 💰 Unstake and claim rewards
- 📊 View total commitments and reward pool

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Configuration

- **Contract Address**: `0xdECA90a8476F69277E593deC1c4b6C78e9891d82`
- **Network**: Celo Mainnet
- **Wallet**: Reown (WalletConnect) with project ID: `0587c6b4e5fa71469bb986a836ab8607`

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Wagmi
- Viem
- Reown AppKit (WalletConnect)

