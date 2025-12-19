# Phase 6: Resolution & Payouts - Implementation Plan

## 🎯 Objective
Enable market resolution by admins and automatic payout distribution to winning positions.

## 📋 Current State Analysis

### ✅ Already Implemented:
- `resolution.ts` service with basic structure
- `market-resolution.tsx` component with UI
- `/api/markets/:id/resolve` endpoint
- Database schema supports `isResolved` and `resolvedOutcomeId`

### ⚠️ Needs Implementation:
1. Update market resolution in database
2. Get all positions for payout calculation
3. Add claim functionality for winners
4. Smart contract integration for resolution
5. Frontend claim UI

## 🔧 Implementation Tasks

### Task 1: Fix Resolution Service
**File:** `server/resolution.ts`

**Changes:**
- Fix `updateMarketResolution` to actually update database
- Fix `calculatePayouts` to get all market positions
- Add proper error handling
- Add resolution event logging

### Task 2: Add Storage Methods
**File:** `server/storage.ts`

**Add methods:**
- `resolveMarket(marketId, outcomeId)` - Update market resolution
- `getMarketPositions(marketId)` - Get all positions for a market
- `getAllPositions()` - Get all positions (for payout calculation)

### Task 3: Add Claim Endpoint
**File:** `server/routes.ts`

**Add:**
- `POST /api/markets/:id/claim` - Claim winnings for resolved market
- Validate market is resolved
- Calculate claimable amount
- Transfer funds to user
- Mark position as claimed

### Task 4: Smart Contract Integration
**File:** `client/src/hooks/use-contracts.ts`

**Add:**
- `resolveMarket(marketId, outcomeId)` - Call resolution on contract
- `claimWinnings(marketId, outcomeId)` - Redeem winning positions

### Task 5: Claim UI Component
**File:** `client/src/components/claim-winnings.tsx` (NEW)

**Features:**
- Show claimable amount
- Claim button
- Transaction status
- Success/error handling

### Task 6: Update Portfolio Page
**File:** `client/src/pages/portfolio.tsx`

**Add:**
- Show resolved markets separately
- Display claimable winnings
- Claim button for each winning position

## 📊 Database Schema Updates

### Markets Table:
```sql
- isResolved: BOOLEAN (already exists)
- resolvedOutcomeId: INTEGER (already exists)
- resolvedAt: TIMESTAMP (add if needed)
- resolvedBy: VARCHAR (add if needed)
```

### Positions Table:
```sql
- isClaimed: BOOLEAN (add)
- claimedAt: TIMESTAMP (add)
- claimAmount: DECIMAL (add)
```

## 🔄 Resolution Flow

### Admin Resolution:
1. Admin selects winning outcome
2. Provides evidence/source
3. Submits resolution
4. Backend updates market status
5. Backend calculates payouts
6. WebSocket broadcasts resolution
7. Users see "Claim Winnings" button

### User Claim:
1. User views resolved market in portfolio
2. Sees claimable amount
3. Clicks "Claim Winnings"
4. Transaction sent to blockchain
5. Funds transferred to user
6. Position marked as claimed
7. Balance updated

## 🧪 Testing Scenarios

### Scenario 1: Admin Resolves Market
- Admin resolves market to "Yes"
- All "Yes" positions become claimable
- All "No" positions show $0 value

### Scenario 2: User Claims Winnings
- User has winning position
- Clicks claim button
- Receives USDC payout
- Position marked as claimed

### Scenario 3: Multiple Claims
- User has multiple winning positions
- Can claim each separately
- Total balance increases correctly

### Scenario 4: Already Claimed
- User tries to claim twice
- System prevents double claiming
- Shows "Already Claimed" status

## 🎯 Success Criteria

- ✅ Admins can resolve markets
- ✅ Winning positions calculated correctly
- ✅ Users can claim winnings
- ✅ Payouts distributed accurately
- ✅ No double claiming possible
- ✅ Blockchain integration works
- ✅ Real-time updates via WebSocket

## 📝 Implementation Order

1. **Storage Methods** (15 min)
   - Add `resolveMarket`
   - Add `getMarketPositions`
   - Add claim tracking

2. **Resolution Service** (20 min)
   - Fix `updateMarketResolution`
   - Fix `calculatePayouts`
   - Add logging

3. **Claim Endpoint** (20 min)
   - Add `/api/markets/:id/claim`
   - Validation logic
   - Payout calculation

4. **Smart Contract Hook** (15 min)
   - Add `resolveMarket`
   - Add `claimWinnings`

5. **Claim UI Component** (25 min)
   - Create component
   - Add to portfolio
   - Transaction handling

6. **Testing** (20 min)
   - Test resolution flow
   - Test claim flow
   - Test edge cases

**Total Estimated Time: 2 hours**

---

*Phase 6 will complete the core trading lifecycle: Buy → Sell → Resolve → Claim*
