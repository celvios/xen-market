-- Performance indexes for faster queries
-- Run this SQL to add indexes to your database

-- Outcomes table indexes
CREATE INDEX IF NOT EXISTS idx_outcomes_market_id ON outcomes(market_id);

-- Positions table indexes
CREATE INDEX IF NOT EXISTS idx_positions_user_id ON positions(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_market_id ON positions(market_id);
CREATE INDEX IF NOT EXISTS idx_positions_outcome_id ON positions(outcome_id);
CREATE INDEX IF NOT EXISTS idx_positions_user_market ON positions(user_id, market_id);

-- Trades table indexes
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_market_id ON trades(market_id);
CREATE INDEX IF NOT EXISTS idx_trades_outcome_id ON trades(outcome_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_market_id ON orders(market_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_outcome_id ON orders(outcome_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_market_status ON orders(market_id, status);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Markets table indexes
CREATE INDEX IF NOT EXISTS idx_markets_featured ON markets(is_featured DESC);
CREATE INDEX IF NOT EXISTS idx_markets_created_at ON markets(created_at DESC);
