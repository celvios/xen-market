import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { parseEther } from "viem";

interface GasEstimation {
  gasLimit: bigint;
  gasPrice: bigint;
  totalCost: bigint;
  totalCostUSD: string;
}

export function useGasEstimation() {
  const [gasData, setGasData] = useState<GasEstimation | null>(null);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();

  const estimateGas = async (to: string, data: string, value = "0") => {
    if (!publicClient) return null;

    setLoading(true);
    try {
      const gasLimit = await publicClient.estimateGas({
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        value: parseEther(value),
      });

      const gasPrice = await publicClient.getGasPrice();
      const totalCost = gasLimit * gasPrice;
      
      // Rough ETH to USD conversion (in production, use real price feed)
      const ethPriceUSD = 2000; // Mock price
      const totalCostUSD = (Number(totalCost) / 1e18 * ethPriceUSD).toFixed(4);

      const estimation = {
        gasLimit,
        gasPrice,
        totalCost,
        totalCostUSD,
      };

      setGasData(estimation);
      return estimation;
    } catch (error) {
      console.error("Gas estimation failed:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    gasData,
    loading,
    estimateGas,
  };
}