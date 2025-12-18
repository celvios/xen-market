# Xen Markets - Testing Guide

## 🚀 Quick Start Testing

### 1. Start the Development Server
```bash
npm run dev
```
Server will start on `http://localhost:3000`

### 2. Basic Functionality Tests

#### **A. Market Discovery (Homepage)**
- ✅ Navigate to `http://localhost:3000`
- ✅ Verify markets are displayed
- ✅ Check category filters work
- ✅ Test market card clicks navigate to details

#### **B. Wallet Connection**
- ✅ Click "Connect Wallet" button
- ✅ Verify wallet connection modal appears
- ✅ Test with MetaMask (if available)
- ✅ Check user balance displays after connection

#### **C. Market Creation**
- ✅ Navigate to `/create`
- ✅ Fill out market form:
  - Question: "Will Bitcoin reach $100k by 2024?"
  - Category: "Crypto"
  - End Date: Future date
  - Outcomes: "Yes" and "No"
- ✅ Submit form and verify market appears in list

### 3. Trading Flow Tests

#### **A. Market Detail Page**
- ✅ Navigate to any market (`/market/1`)
- ✅ Verify components load:
  - Price chart displays
  - Order book shows buy/sell orders
  - Trading interface is functional
  - Market resolution panel (if admin)

#### **B. Place Buy Order**
- ✅ Connect wallet first
- ✅ Enter amount (e.g., $10)
- ✅ Select outcome ("Yes" or "No")
- ✅ Click "Place Buy Order"
- ✅ Verify transaction status dialog appears
- ✅ Check order appears in order book
- ✅ Verify position shows in portfolio

#### **C. Real-Time Updates**
- ✅ Open market in two browser tabs
- ✅ Place order in one tab
- ✅ Verify order appears in other tab instantly
- ✅ Check WebSocket connection in DevTools Network tab

### 4. Portfolio Tests

#### **A. Portfolio Page**
- ✅ Navigate to `/portfolio`
- ✅ Verify positions display correctly
- ✅ Check P&L calculations show
- ✅ Test portfolio value calculations

#### **B. Activity Page**
- ✅ Navigate to `/activity`
- ✅ Verify trade history displays
- ✅ Check trade details are accurate

### 5. Advanced Feature Tests

#### **A. Order Book Functionality**
- ✅ Place multiple buy orders at different prices
- ✅ Place sell orders at different prices
- ✅ Verify orders sort correctly (buy: high to low, sell: low to high)
- ✅ Check spread calculation displays

#### **B. Price Chart**
- ✅ Verify chart loads with historical data
- ✅ Check tooltip shows on hover
- ✅ Test chart responsiveness

#### **C. Market Resolution (Admin)**
- ✅ Navigate to market detail page
- ✅ If admin, verify resolution panel shows
- ✅ Select winning outcome
- ✅ Provide evidence
- ✅ Submit resolution
- ✅ Verify market resolves after 5 seconds

### 6. Error Handling Tests

#### **A. Network Errors**
- ✅ Disconnect internet
- ✅ Try to place order
- ✅ Verify error message displays
- ✅ Reconnect and retry

#### **B. Invalid Inputs**
- ✅ Try to place order with $0 amount
- ✅ Try to place order without wallet connection
- ✅ Verify appropriate error messages

#### **C. Component Errors**
- ✅ Navigate to non-existent market (`/market/999`)
- ✅ Verify "Market not found" message
- ✅ Test error boundary by causing React error

## 🔧 Technical Testing

### 1. API Endpoints
Test all endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3000/api/health

# Get markets
curl http://localhost:3000/api/markets

# Get market by ID
curl http://localhost:3000/api/markets/1

# Create user (wallet auth)
curl -X POST http://localhost:3000/api/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234567890123456789012345678901234567890"}'
```

### 2. WebSocket Testing
Open browser DevTools Console and test:

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3000/ws');

// Subscribe to market updates
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    data: { marketId: 1 }
  }));
};

// Listen for messages
ws.onmessage = (event) => {
  console.log('WebSocket message:', JSON.parse(event.data));
};
```

### 3. Database Testing
If using PostgreSQL:

```bash
# Check database connection
npm run db:push

# Verify tables created
psql -d your_database -c "\dt"
```

### 4. Smart Contract Testing
If contracts are deployed:

```bash
# Navigate to contracts directory
cd packages/contracts

# Run contract tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

## 📊 Performance Testing

### 1. Load Testing
- ✅ Open 10+ browser tabs to same market
- ✅ Place orders simultaneously
- ✅ Verify server handles load
- ✅ Check WebSocket connections remain stable

### 2. Memory Testing
- ✅ Monitor browser memory usage
- ✅ Navigate between pages multiple times
- ✅ Verify no memory leaks

### 3. Network Testing
- ✅ Test on slow 3G connection
- ✅ Verify loading states display
- ✅ Check offline functionality

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:** Check if `DATABASE_URL` is set. If not, app runs in mock mode.

### Issue: "WebSocket connection failed"
**Solution:** Ensure server is running and port 3000 is available.

### Issue: "Market not found"
**Solution:** Create markets first using `/create` page or seed data.

### Issue: "Wallet connection failed"
**Solution:** Install MetaMask or use mock wallet connection.

### Issue: "Orders not matching"
**Solution:** Ensure buy price >= sell price for matching to occur.

## ✅ Test Checklist

### Core Functionality
- [ ] Server starts without errors
- [ ] Homepage loads and displays markets
- [ ] Wallet connection works
- [ ] Market creation works
- [ ] Order placement works
- [ ] Portfolio displays correctly
- [ ] Real-time updates work

### UI Components
- [ ] Price charts render
- [ ] Order book displays
- [ ] P&L calculator shows correct values
- [ ] Transaction status dialogs work
- [ ] Market resolution interface works
- [ ] Error boundaries catch errors

### API Endpoints
- [ ] All GET endpoints return data
- [ ] POST endpoints accept data
- [ ] WebSocket connections establish
- [ ] Real-time broadcasting works

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Invalid inputs show errors
- [ ] Component errors caught by boundary
- [ ] Recovery mechanisms work

## 🎯 Success Criteria

**Phase 1 is 100% complete when:**
1. All core trading flows work end-to-end
2. Real-time updates function properly
3. Error handling is robust
4. UI components render correctly
5. API endpoints respond properly
6. WebSocket connections are stable
7. Order matching executes trades
8. Market resolution distributes payouts

**Ready for Phase 2 when all tests pass!**