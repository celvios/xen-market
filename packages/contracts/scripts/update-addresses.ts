const fs = require("fs");

const addresses = {
    CONDITIONAL_TOKENS_ADDRESS: "0xa0a04094b602f65d053c7d957b71c47734431a68",
    MARKET_FACTORY_ADDRESS: "0x701e59e245b25851d9a8e4c92741aa98eb1e922f",
    ORDER_BOOK_ADDRESS: "PENDING_DEPLOYMENT"
};

fs.writeFileSync("../../addresses.json", JSON.stringify(addresses, null, 2));
console.log("Updated addresses.json");
