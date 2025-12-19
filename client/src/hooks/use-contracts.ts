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
        const apiUrl = import.meta.env.VITE_API_URL || "";
        fetch(`${apiUrl}/api/config`)
            .then(res => res.json())
            .then(data => {
                console.log("Contract addresses loaded:", data);
                setAddresses(data);
            })
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

    const placeOrder = async (params: { 
        marketId: number;
        outcomeId: number;
        amount: string;
        price: string;
        isBuy: boolean;
    }) => {
        if (!addresses.ORDER_BOOK_ADDRESS) {
            throw new Error("OrderBook contract not deployed");
        }

        try {
            // First approve USDC
            const usdcAddress = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" as Address;
            const usdcAbi = [
                {
                    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
                    name: "approve",
                    outputs: [{ name: "", type: "bool" }],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ] as const;

            const approvalTx = await writeContractAsync({
                address: usdcAddress,
                abi: usdcAbi,
                functionName: "approve",
                args: [addresses.ORDER_BOOK_ADDRESS as Address, parseUnits(params.amount, 6)],
            });

            console.log("USDC approved:", approvalTx);

            // Then place order
            const orderTx = await writeContractAsync({
                address: addresses.ORDER_BOOK_ADDRESS as Address,
                abi: OrderBookABI,
                functionName: "placeOrder",
                args: [
                    BigInt(params.marketId),
                    BigInt(params.outcomeId),
                    parseUnits(params.amount, 6),
                    parseUnits(params.price, 2),
                    params.isBuy
                ],
            });
            
            return orderTx;
        } catch (error) {
            console.error("Place order failed:", error);
            throw error;
        }
    };

    const approveUSDC = async (spender: Address, amount: string) => {
        const usdcAddress = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" as Address;
        const usdcAbi = [
            {
                inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
            },
        ] as const;

        try {
            const tx = await writeContractAsync({
                address: usdcAddress,
                abi: usdcAbi,
                functionName: "approve",
                args: [spender, parseUnits(amount, 6)],
            });
            return tx;
        } catch (error) {
            console.error("USDC approval failed:", error);
            throw error;
        }
    };

    const sellShares = async (params: { 
        marketId: number;
        outcomeId: number;
        shares: string;
        price: string;
    }) => {
        if (!addresses.ORDER_BOOK_ADDRESS) {
            throw new Error("OrderBook contract not deployed");
        }

        try {
            // Place sell order on OrderBook
            const orderTx = await writeContractAsync({
                address: addresses.ORDER_BOOK_ADDRESS as Address,
                abi: OrderBookABI,
                functionName: "placeOrder",
                args: [
                    BigInt(params.marketId),
                    BigInt(params.outcomeId),
                    parseUnits(params.shares, 6), // shares as amount
                    parseUnits(params.price, 2),
                    false // isBuy = false for sell orders
                ],
            });
            
            return orderTx;
        } catch (error) {
            console.error("Sell order failed:", error);
            throw error;
        }
    };

    return {
        addresses,
        splitPosition,
        placeOrder,
        sellShares,
        approveUSDC
    };
}
