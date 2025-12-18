import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { useContracts } from './use-contracts';

export function usePlaceOrder() {
  const { orderBookAddress, orderBookAbi } = useContracts();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const placeOrder = async (
    positionId: string,
    amount: string,
    price: string,
    isBuy: boolean
  ) => {
    if (!orderBookAddress || !orderBookAbi) {
      throw new Error('Contract not configured');
    }

    const amountWei = parseUnits(amount, 18);
    const priceWei = parseUnits(price, 18);

    writeContract({
      address: orderBookAddress as `0x${string}`,
      abi: orderBookAbi,
      functionName: 'placeOrder',
      args: [positionId as `0x${string}`, amountWei, priceWei, isBuy],
    });
  };

  return {
    placeOrder,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useCancelOrder() {
  const { orderBookAddress, orderBookAbi } = useContracts();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelOrder = async (orderId: number) => {
    if (!orderBookAddress || !orderBookAbi) {
      throw new Error('Contract not configured');
    }

    writeContract({
      address: orderBookAddress as `0x${string}`,
      abi: orderBookAbi,
      functionName: 'cancelOrder',
      args: [BigInt(orderId)],
    });
  };

  return {
    cancelOrder,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
