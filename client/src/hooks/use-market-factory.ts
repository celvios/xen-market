import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useContracts } from './use-contracts';

export function useCreateMarket() {
  const { marketFactoryAddress, marketFactoryAbi } = useContracts();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createMarket = async (
    question: string,
    endTime: number,
    numOutcomes: number,
    oracle: string
  ) => {
    if (!marketFactoryAddress || !marketFactoryAbi) {
      throw new Error('Contract not configured');
    }

    writeContract({
      address: marketFactoryAddress as `0x${string}`,
      abi: marketFactoryAbi,
      functionName: 'createMarket',
      args: [question, BigInt(endTime), BigInt(numOutcomes), oracle as `0x${string}`],
    });
  };

  return {
    createMarket,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
