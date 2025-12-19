import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying MockUSDC...");

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();

  const address = await usdc.getAddress();
  console.log("MockUSDC deployed to:", address);

  // Update addresses.json
  const addressesPath = path.resolve(__dirname, "../../../addresses.json");
  let addresses: any = {};
  
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
  }

  addresses.MOCK_USDC_ADDRESS = address;
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

  console.log("Updated addresses.json");
  console.log("\nTo verify on Polygonscan:");
  console.log(`npx hardhat verify --network polygonAmoy ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
