const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("Starting remaining deployments...");
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL");
    
    const ctAddress = "0xa0a04094b602f65d053c7d957b71c47734431a68";
    console.log("Using ConditionalTokens:", ctAddress);
    
    console.log("\nDeploying MarketFactory...");
    const MarketFactory = await ethers.getContractFactory("MarketFactory");
    const factory = await MarketFactory.deploy(ctAddress);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`✓ MarketFactory: ${factoryAddress}`);

    console.log("\nDeploying OrderBook...");
    const OrderBook = await ethers.getContractFactory("OrderBook");
    const orderBook = await OrderBook.deploy();
    await orderBook.waitForDeployment();
    const orderBookAddress = await orderBook.getAddress();
    console.log(`✓ OrderBook: ${orderBookAddress}`);

    const addresses = {
        CONDITIONAL_TOKENS_ADDRESS: ctAddress,
        MARKET_FACTORY_ADDRESS: factoryAddress,
        ORDER_BOOK_ADDRESS: orderBookAddress
    };

    fs.writeFileSync("../../addresses.json", JSON.stringify(addresses, null, 2));
    console.log("\n✓ Deployment complete! Saved to addresses.json");
}

main().catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
});
