import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { parseUnits, zeroAddress, type Address } from "viem";
import { ConditionalTokensABI } from "../lib/abi/ConditionalTokens";
import { OrderBookABI } from "../lib/abi/OrderBook";

export function useContracts() {
    const [addresses, setAddresses] = useState<Record<string, string>>({});
    const { writeContractAsync } = useWriteContract();
    const publicClient = usePublicClient();
    const { address } = useAccount();

    useEffect(() => {
        fetch("/api/config")
            .then(res => res.json())
            .then(data => setAddresses(data))
            .catch(err => console.error("Failed to fetch contract addresses:", err));
    }, []);

    const splitPosition = async (conditionId: string, amount: string) => {
        if (!addresses.CONDITIONAL_TOKENS_ADDRESS) return;

        try {
            const tx = await writeContractAsync({
                address: addresses.CONDITIONAL_TOKENS_ADDRESS as Address,
                abi: ConditionalTokensABI,
                functionName: "splitPosition",
                args: [
                    zeroAddress, // collateralToken (Mock)
                    "0x0000000000000000000000000000000000000000000000000000000000000000", // parentCollectionId
                    conditionId as Address,
                    [BigInt(1), BigInt(2)], // partition (Full split)
                    parseUnits(amount, 18)
                ],
            });
            return tx;
        } catch (error) {
            console.error("Split position failed:", error);
            throw error;
        }
    };

    const placeOrder = async (order: { positionId: string, amount: string, price: string, isBuy: boolean }) => {
        if (!addresses.ORDER_BOOK_ADDRESS) return;

        try {
            const tx = await writeContractAsync({
                address: addresses.ORDER_BOOK_ADDRESS as Address,
                abi: OrderBookABI,
                functionName: "placeOrder",
                args: [
                    order.positionId as Address,
                    parseUnits(order.amount, 18),
                    parseUnits(order.price, 18),
                    order.isBuy
                ],
            });
            return tx;
        } catch (error) {
            console.error("Place order failed:", error);
            throw error;
        }
    };

    return {
        addresses,
        splitPosition,
        placeOrder
    };
}
