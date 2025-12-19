import { storage } from "./storage";
import { type InsertMarket, type InsertOutcome } from "@shared/schema";
import { createPublicClient, http, parseAbiItem } from "viem";
import { polygonAmoy } from "viem/chains";
import fs from "fs";
import path from "path";

// TODO: Replace with actual deployed addresses after deployment
let MARKET_FACTORY_ADDRESS = (process.env.MARKET_FACTORY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`;

const addressesPath = path.resolve(process.cwd(), "addresses.json");
if (fs.existsSync(addressesPath)) {
    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
    if (addresses.MARKET_FACTORY_ADDRESS) {
        MARKET_FACTORY_ADDRESS = addresses.MARKET_FACTORY_ADDRESS;
        console.log(`Indexer using MarketFactory from addresses.json: ${MARKET_FACTORY_ADDRESS}`);
    }
}

const publicClient = createPublicClient({
    chain: polygonAmoy,
    transport: http("https://rpc-amoy.polygon.technology")
});

const MarketCreatedAbi = parseAbiItem(
    "event MarketCreated(bytes32 indexed marketId, string question, address indexed creator, address oracle, uint256 endTime, bytes32 conditionId)"
);

export class IndexerService {
    private isIndexing = false;
    private lastBlockIndexed = 0n;

    async start() {
        if (this.isIndexing) return;
        this.isIndexing = true;
        console.log("Indexer Service Started (Polling mode)...");

        try {
            this.lastBlockIndexed = await publicClient.getBlockNumber();
            console.log(`Starting indexer from block: ${this.lastBlockIndexed}`);
        } catch (e) {
            console.warn("Could not connect to blockchain node. Indexer will retry in loop.");
        }

        this.poll();
    }

    private async poll() {
        while (this.isIndexing) {
            try {
                await this.checkForNewMarkets();
            } catch (error: any) {
                // Silently ignore connection errors during polling
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    async checkForNewMarkets() {
        const currentBlock = await publicClient.getBlockNumber();
        if (currentBlock <= this.lastBlockIndexed) return;

        const logs = await publicClient.getLogs({
            address: MARKET_FACTORY_ADDRESS,
            event: MarketCreatedAbi,
            fromBlock: this.lastBlockIndexed + 1n,
            toBlock: currentBlock
        });

        for (const log of logs) {
            await this.indexMarket(log);
        }

        this.lastBlockIndexed = currentBlock;
    }

    async indexMarket(log: any) {
        const { marketId, question, endTime, conditionId } = log.args;
        console.log(`Indexing new on-chain market: ${question}`);

        const market: InsertMarket = {
            title: question,
            description: "Automatically indexed from blockchain",
            image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
            category: "Crypto",
            endDate: new Date(Number(endTime) * 1000).toISOString(),
            conditionId: conditionId,
            txHash: log.transactionHash,
            volume: "0",
            isFeatured: false,
            isResolved: false
        };

        const outcomes: InsertOutcome[] = [
            { label: "YES", probability: "0.5", color: "bg-primary" },
            { label: "NO", probability: "0.5", color: "bg-destructive" }
        ];

        await storage.createMarket(market, outcomes);
    }
}

export const indexer = new IndexerService();
