const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying OrderBook...");
    const [deployer] = await ethers.getSigners();
    console.log("From:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL");
    
    const OrderBook = await ethers.getContractFactory("OrderBook");
    const orderBook = await OrderBook.deploy();
    console.log("Waiting for deployment...");
    await orderBook.waitForDeployment();
    const address = await orderBook.getAddress();
    console.log("✓ OrderBook:", address);
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});
