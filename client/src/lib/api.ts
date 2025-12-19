// API client functions
import { config } from './config';

const API_URL = `${config.apiUrl}/api`;

export interface Market {
  id: number;
  title: string;
  description: string | null;
  image: string;
  category: string;
  endDate: string;
  volume: string;
  isFeatured: boolean | null;
  isResolved: boolean | null;
  resolvedOutcomeId: number | null;
  createdAt: string;
  outcomes: Outcome[];
}

export interface Outcome {
  id: number;
  marketId: number;
  label: string;
  probability: string;
  color: string;
}

export interface User {
  id: string;
  walletAddress: string | null;
  username: string | null;
  balance: string;
  createdAt: string;
}

export interface Position {
  id: number;
  userId: string;
  marketId: number;
  outcomeId: number;
  shares: string;
  avgPrice: string;
  createdAt: string;
  updatedAt: string;
  market: Market;
  outcome: Outcome;
}

export interface Trade {
  id: number;
  userId: string;
  marketId: number;
  outcomeId: number;
  type: string;
  shares: string;
  price: string;
  totalAmount: string;
  createdAt: string;
  market: Market;
  outcome: Outcome;
}

// Markets
export async function fetchMarkets(): Promise<Market[]> {
  const res = await fetch(`${API_URL}/markets`);
  if (!res.ok) throw new Error("Failed to fetch markets");
  return res.json();
}

export async function fetchMarket(id: number): Promise<Market> {
  const res = await fetch(`${API_URL}/markets/${id}`);
  if (!res.ok) throw new Error("Failed to fetch market");
  return res.json();
}

// Auth
export async function authenticateWallet(walletAddress: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/wallet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) throw new Error("Authentication failed");
  return res.json();
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Trading
export async function executeBuy(params: {
  userId: string;
  marketId: number;
  outcomeId: number;
  amountUSD: number;
  price: number;
}): Promise<{ trade: Trade; newBalance: string }> {
  const res = await fetch(`${API_URL}/trade/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Trade failed");
  }
  return res.json();
}

export async function executeSell(params: {
  userId: string;
  marketId: number;
  outcomeId: number;
  shares: number;
  price: number;
}): Promise<{ trade: Trade; newBalance: string }> {
  const res = await fetch(`${API_URL}/trade/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Trade failed");
  }
  return res.json();
}

// Portfolio
export async function fetchPortfolio(userId: string): Promise<Position[]> {
  const res = await fetch(`${API_URL}/portfolio/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
}

// Activity
export async function fetchActivity(userId: string): Promise<Trade[]> {
  const res = await fetch(`${API_URL}/activity/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch activity");
  return res.json();
}

// Leaderboard
export async function fetchLeaderboard(limit: number = 10): Promise<{ user: User; profit: number }[]> {
  const res = await fetch(`${API_URL}/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

// Order Book
export interface OrderBookData {
  bids: { price: number; size: number; total: number }[];
  asks: { price: number; size: number; total: number }[];
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
  lastPrice: number | null;
}

export async function fetchOrderBook(marketId: number, outcomeId: number): Promise<OrderBookData> {
  const res = await fetch(`${API_URL}/markets/${marketId}/outcomes/${outcomeId}/orderbook`);
  if (!res.ok) throw new Error("Failed to fetch order book");
  return res.json();
}
