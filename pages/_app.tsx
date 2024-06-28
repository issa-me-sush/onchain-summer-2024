import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider ,createConfig,http} from 'wagmi';
import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider,connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
// Enable Coinbase Smart Wallet for testing
coinbaseWallet.preference = 'smartWalletOnly';
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [coinbaseWallet],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: '8bfb5108a6332499700ca9e62adf9b84',
  }
);
const config = createConfig({
  chains: [baseSepolia, sepolia],
  ssr: true, 
  transports: {
    [baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com'),
    [sepolia.id]: http('https://sepolia.drpc.org'),
  },
  connectors: connectors
})

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
