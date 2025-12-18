const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("Starting deployment...");

    const ConditionalTokens = await ethers.getContractFactory("ConditionalTokens");
    const ct = await ConditionalTokens.deploy();
    await ct.waitForDeployment();
    const ctAddress = await ct.getAddress();
    console.log(`ConditionalTokens deployed to: ${ctAddress}`);

    const MarketFactory = await ethers.getContractFactory("MarketFactory");
    const factory = await MarketFactory.deploy(ctAddress);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`MarketFactory deployed to: ${factoryAddress}`);

    const OrderBook = await ethers.getContractFactory("OrderBook");
    const orderBook = await OrderBook.deploy();
    await orderBook.waitForDeployment();
    const orderBookAddress = await orderBook.getAddress();
    console.log(`OrderBook deployed to: ${orderBookAddress}`);

    console.log("\nDeployment complete!");
    const addresses = {
        MARKET_FACTORY_ADDRESS: factoryAddress,
        CONDITIONAL_TOKENS_ADDRESS: ctAddress,
        ORDER_BOOK_ADDRESS: orderBookAddress
    };

    fs.writeFileSync("../../addresses.json", JSON.stringify(addresses, null, 2));
    console.log("Addresses saved to addresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
