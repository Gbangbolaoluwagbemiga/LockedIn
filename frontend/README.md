# 🔒 LockedIn Frontend

A beautiful, modern frontend for the LockedIn commitment contract platform built on Celo.

## 🚀 Features

- **Wallet Integration**: Connect with MetaMask, Valora, and other Celo-compatible wallets
- **Create Commitments**: Lock CELO to commit to your goals with customizable durations
- **Track Progress**: View all commitments with real-time countdown timers
- **Claim Rewards**: Unstake and claim rewards when you complete your commitments
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Real-time Updates**: Live updates of commitment status and reward pools

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling
- **Wagmi** - React hooks for Ethereum/Celo
- **Reown AppKit** - Beautiful wallet connection UI (formerly WalletConnect)
- **Viem** - TypeScript interface for blockchain interactions

## 📦 Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...your_deployed_contract_address
```

3. Set up Reown (WalletConnect) Project ID:

The Project ID is already configured in the code: `0587c6b4e5fa71469bb986a836ab8607`

If you need to change it, create a `.env.local` file with:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=0587c6b4e5fa71469bb986a836ab8607
```

4. Deploy the contract and update `NEXT_PUBLIC_CONTRACT_ADDRESS`:

- Deploy the LockedIn contract to Celo (see main README)
- Copy the deployed contract address to `.env.local`

## 🏃 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Networks

The app is configured to work with:
- **Celo Alfajores Testnet** (default for development)
- **Celo Mainnet** (production)

Make sure your wallet is connected to the correct network.

## 📝 Usage

1. **Connect Wallet**: Click the "Connect Wallet" button and select your wallet
2. **Create Commitment**: 
   - Enter your goal description
   - Set the duration in days
   - Specify the stake amount in CELO
   - Click "Lock It In"
3. **Mark Complete**: If you complete your goal before the deadline, mark it as completed
4. **Unstake & Claim**: After the deadline, unstake to get your stake back (and rewards if completed)

## 🎨 Features

- **Real-time Countdown**: See exactly how much time is left for each commitment
- **Reward Estimation**: View estimated rewards before completing commitments
- **Status Tracking**: Visual indicators for active, completed, and expired commitments
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dark Mode**: Automatic dark mode support based on system preferences

## 🔧 Configuration

### Contract Address

Update the contract address in `.env.local` after deploying:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### WalletConnect

Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com) and add it to `.env.local`.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Reown AppKit Documentation](https://docs.reown.com/appkit)
- [Celo Documentation](https://docs.celo.org)
