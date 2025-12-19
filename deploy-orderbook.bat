@echo off
echo ========================================
echo Deploying OrderBookV2 to Polygon Amoy
echo ========================================
echo.

cd packages\contracts

echo Step 1: Installing dependencies...
call npm install
echo.

echo Step 2: Compiling contracts...
call npx hardhat compile
echo.

echo Step 3: Deploying OrderBookV2...
call npx hardhat run scripts/deploy-orderbook-v2.ts --network polygonAmoy
echo.

echo ========================================
echo Deployment Complete!
echo Check addresses.json for new address
echo ========================================
pause
