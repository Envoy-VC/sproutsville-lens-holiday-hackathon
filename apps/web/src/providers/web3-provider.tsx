import type { PropsWithChildren } from 'react';

import { chains } from '@lens-network/sdk/viem';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';

export const config = createConfig(
  getDefaultConfig({
    chains: [chains.testnet],
    transports: {
      [chains.testnet.id]: http(chains.testnet.rpcUrls.default.http[0]),
    },

    walletConnectProjectId: import.meta.env.VITE_REOWN_PROJECT_ID,
    appName: 'Sproutsville',
    appDescription:
      'Sproutsville is a social network for farming enthusiasts, built on Lens Protocol.',
    appUrl: 'https://sproutsville.vercel.app',
    appIcon: 'https://sproutsville.vercel.app/logo-text.png',
  })
);

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiProvider>
  );
};
