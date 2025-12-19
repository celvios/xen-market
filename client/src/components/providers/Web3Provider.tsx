import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { queryClient } from '@/lib/queryClient';

const projectId = '9945df869a89d702d7e974e7fc533383';

const metadata = {
  name: 'Xen Markets',
  description: 'Decentralized Prediction Markets',
  url: 'https://xenmarkets.com',
  icons: ['https://xenmarkets.com/icon.png']
};

const wagmiAdapter = new WagmiAdapter({
  networks: [polygonAmoy],
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [polygonAmoy],
  projectId,
  metadata,
  features: {
    analytics: true,
  }
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
