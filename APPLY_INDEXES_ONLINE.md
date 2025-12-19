# 🔧 Apply Database Indexes (No psql needed)

## Option 1: Use Render Dashboard (Easiest)

1. Go to: https://dashboard.render.com
2. Click on your PostgreSQL database: `xenmarkets`
3. Click "Connect" → "PSQL Command"
4. Copy the command and run in terminal (if you have psql)

OR

3. Click "Shell" tab
4. Paste these commands one by one:

```sql
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_market_id ON positions(market_id);
CREATE INDEX IF NOT EXISTS idx_positions_outcome_id ON positions(outcome_id);
CREATE INDEX IF NOT EXISTS idx_positions_user_market ON positions(user_id, market_id);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_market_id ON trades(market_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_market_created ON trades(market_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_market_id ON orders(market_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_market_status ON orders(market_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_outcome_status ON orders(outcome_id, status);

CREATE INDEX IF NOT EXISTS idx_markets_is_resolved ON markets(is_resolved);
CREATE INDEX IF NOT EXISTS idx_markets_category ON markets(category);
CREATE INDEX IF NOT EXISTS idx_markets_created_at ON markets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
```

## Option 2: Use Online PostgreSQL Client

1. Go to: https://sqliteonline.com/ (supports PostgreSQL)
2. Click "PostgreSQL" tab
3. Click "Connect to Database"
4. Enter:
   - Host: `dpg-d5265l7pm1nc73ei1km0-a.oregon-postgres.render.com`
   - Port: `5432`
   - Database: `xenmarkets`
   - User: `xenmarkets`
   - Password: `nqY4FCrH5ex8XdeOo1nzzFVhE6WmGJ9q`
5. Paste the SQL commands above
6. Click "Run"

## Option 3: Skip for Now

The indexes are optional. Your app will work without them, just slower with many users.

You can apply them later when needed.

---

## ✅ Verify Indexes Applied

Run this query to check:
```sql
SELECT indexname FROM pg_indexes WHERE tablename IN ('positions', 'trades', 'orders', 'markets', 'users');
```

Should show all the indexes listed above.

---

**Choose the easiest option for you!**
