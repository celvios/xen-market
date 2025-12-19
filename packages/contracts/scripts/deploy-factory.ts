const { ethers } = require("hardhat");

async function main() {
    const ctAddress = "0xa0a04094b602f65d053c7d957b71c47734431a68";
    const MarketFactory = await ethers.getContractFactory("MarketFactory");
    const factory = await MarketFactory.deploy(ctAddress);
    await factory.waitForDeployment();
    console.log("MarketFactory:", await factory.getAddress());
}

main().catch(console.error);
