const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    // Create a new random wallet
    const newWallet = ethers.Wallet.createRandom();
    console.log("\n🔑 NEW TEMPORARY WALLET:");
    console.log("Address:", newWallet.address);
    console.log("Private Key:", newWallet.privateKey);
    console.log("\n⚠️  SAVE THIS PRIVATE KEY! You'll need it to complete deployment.");
    console.log("\n📝 Steps:");
    console.log("1. Get testnet POL from: https://faucet.quicknode.com/polygon/amoy");
    console.log("2. Add this to .env: PRIVATE_KEY=" + newWallet.privateKey);
    console.log("3. Run: npx hardhat run scripts/deploy-remaining.ts --network polygonAmoy");
}

main().catch(console.error);
