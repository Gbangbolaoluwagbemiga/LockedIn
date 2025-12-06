'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { Lock, Wallet } from 'lucide-react';
import Link from 'next/link';
import { formatEther } from 'viem';

export function Header() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Get balance
  const { data: balance } = useBalance({
    address: address,
    chainId: 42220, // Celo mainnet
  });

  const handleWalletClick = () => {
    if (isConnected) {
      open();
    } else {
      open();
    }
  };

  const formatBalance = (value: bigint | undefined) => {
    if (!value) return '0.00';
    const formatted = parseFloat(formatEther(value));
    return formatted.toFixed(4);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">LockedIn</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            All Commitments
          </Link>
          <Link
            href="/my-commitments"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            My Commitments
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Balance Display */}
          {isConnected && balance && (
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2">
              <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatBalance(balance.value)} CELO
                </span>
              </div>
            </div>
          )}

          {/* Connect Wallet Button */}
          <button
            onClick={handleWalletClick}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-700"
          >
            {isConnected && address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}

