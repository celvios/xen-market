import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { WagmiProvider } from 'wagmi'
import { hardhat, polygon } from 'wagmi/chains'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

const projectId = '9945df869a89d702d7e974e7fc533383'

const metadata = {
  name: 'Xen Markets',
  description: 'Decentralized Prediction Markets',
  url: 'https://xenmarkets.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [hardhat, polygon] as const

const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  ssr: false
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  metadata,
  projectId,
  features: {
    analytics: true
  }
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
