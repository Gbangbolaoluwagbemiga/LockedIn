'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { celo } from 'wagmi/chains';
import { ReactNode, useState } from 'react';

// Reown (WalletConnect) Project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0587c6b4e5fa71469bb986a836ab8607';

// Get the current URL for metadata
const getAppUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Create wagmi adapter - Celo Mainnet only
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [celo],
  projectId,
});

// Get wagmi config
const wagmiConfig = wagmiAdapter.wagmiConfig;

// Initialize Reown AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [celo],
  metadata: {
    name: 'LockedIn',
    description: 'Lock in your goals by staking CELO',
    url: getAppUrl(),
    icons: [`${getAppUrl()}/icon.png`],
  },
  features: {
    analytics: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#9333ea',
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
