# 🪙 Deploy Mock USDC to Testnet

## Quick Deploy

```bash
cd packages/contracts

# Deploy MockUSDC
npx hardhat run scripts/deploy-mock-usdc.ts --network polygonAmoy
```

This will:
1. Deploy MockUSDC contract to Polygon Amoy testnet
2. Update `addresses.json` with the contract address
3. Users can call `faucet()` to get 1000 USDC

## What is MockUSDC?

- ERC20 token with 6 decimals (like real USDC)
- Anyone can call `faucet()` to mint 1000 USDC
- No restrictions, perfect for testing
- Deployed on Polygon Amoy testnet

## How Users Get USDC

1. User connects wallet with $0 balance
2. "Mock USDC Faucet" card appears in portfolio
3. Click "Claim $1000 USDC"
4. Transaction sent to blockchain
5. 1000 USDC minted to their wallet
6. Balance updated in database

## Contract Functions

```solidity
function faucet() external {
    _mint(msg.sender, 1000 * 10**6); // 1000 USDC
}

function mint(address to, uint256 amount) external {
    _mint(to, amount); // Admin can mint any amount
}
```

## After Deployment

Update the USDC address in the faucet component if needed:

`client/src/components/mock-usdc-faucet.tsx`:
```typescript
const USDC_ADDRESS = "YOUR_DEPLOYED_ADDRESS" as Address;
```

## Verify Contract

```bash
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
```

---

**Users can now get real testnet USDC tokens! 🎉**
