-- Performance Indexes for Xen Markets

-- Positions table indexes
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_market_id ON positions(market_id);
CREATE INDEX IF NOT EXISTS idx_positions_outcome_id ON positions(outcome_id);
CREATE INDEX IF NOT EXISTS idx_positions_user_market ON positions(user_id, market_id);

-- Trades table indexes
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_market_id ON trades(market_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_market_created ON trades(market_id, created_at DESC);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_market_id ON orders(market_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_market_status ON orders(market_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_outcome_status ON orders(outcome_id, status);

-- Markets table indexes
CREATE INDEX IF NOT EXISTS idx_markets_is_resolved ON markets(is_resolved);
CREATE INDEX IF NOT EXISTS idx_markets_category ON markets(category);
CREATE INDEX IF NOT EXISTS idx_markets_created_at ON markets(created_at DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Run this file with: psql $DATABASE_URL -f DATABASE_INDEXES.sql
