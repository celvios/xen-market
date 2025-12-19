const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL");

    const ConditionalTokens = await ethers.getContractFactory("ConditionalTokens");
    const ct = await ConditionalTokens.deploy();
    await ct.waitForDeployment();
    console.log("ConditionalTokens:", await ct.getAddress());
}

main().catch(console.error);
