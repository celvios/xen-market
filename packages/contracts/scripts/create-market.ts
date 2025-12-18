import { ethers } from "hardhat";

async function main() {
    const factoryAddress = process.env.MARKET_FACTORY_ADDRESS;
    if (!factoryAddress) throw new Error("MARKET_FACTORY_ADDRESS not set");

    const factory = await ethers.getContractAt("MarketFactory", factoryAddress);

    console.log("Creating a new on-chain market...");
    const question = "Are we back in the new workspace? " + new Date().toLocaleTimeString();
    const endTime = Math.floor(Date.now() / 1000) + 86400 * 365; // 1 year from now

    const tx = await factory.createMarket(
        question,
        endTime,
        2,
        ethers.ZeroAddress
    );

    await tx.wait();
    console.log("Market created on-chain!");
    console.log(`Transaction Hash: ${tx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
