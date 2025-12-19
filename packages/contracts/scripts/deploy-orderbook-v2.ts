const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying OrderBookV2...");

  const OrderBookV2 = await hre.ethers.getContractFactory("OrderBookV2");
  const orderBook = await OrderBookV2.deploy();
  await orderBook.waitForDeployment();

  const address = await orderBook.getAddress();
  console.log("OrderBookV2 deployed to:", address);

  // Update addresses.json
  const addressesPath = path.resolve(__dirname, "../../../addresses.json");
  let addresses: any = {};
  
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
  }

  addresses.ORDER_BOOK_ADDRESS = address;
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  
  console.log("Updated addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = {};
