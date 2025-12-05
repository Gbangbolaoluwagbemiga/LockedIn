"use client";

import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { celo, celoAlfajores } from "viem/chains";
import { createConfig, http } from "wagmi";
import { createAppKitAdapter } from "@reown/appkit-adapter-wagmi";

const projectId = "0587c6b4e5fa71469bb986a836ab8607";

const metadata = {
  name: "LockedIn",
  description: "Commitment Contract Platform on Celo",
  url: "https://lockedin.xyz",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [celo, celoAlfajores] as const;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const wagmiAdapter = createAppKitAdapter(wagmiConfig, {
  projectId,
  metadata,
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: chains,
  defaultNetwork: celo,
  metadata,
  features: {
    analytics: true,
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

