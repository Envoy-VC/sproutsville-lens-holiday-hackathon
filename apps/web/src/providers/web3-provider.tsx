import type { PropsWithChildren } from 'react';

import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { type Chain } from 'viem';
import { WagmiProvider, createConfig, http } from 'wagmi';

export const lensSepolia: Chain = {
  id: 37111,
  name: 'Lens Network Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Grass',
    symbol: 'GRASS',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.lens.dev'] },
  },
  blockExplorers: {
    default: {
      name: 'Lens Explorer',
      url: 'https://block-explorer.testnet.lens.dev',
    },
  },
  testnet: false,
};

const config = createConfig(
  getDefaultConfig({
    chains: [lensSepolia],
    transports: {
      [lensSepolia.id]: http(),
    },
    walletConnectProjectId: import.meta.env.VITE_REOWN_PROJECT_ID,

    // Required App Info
    appName: 'Your App Name',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiProvider>
  );
};
