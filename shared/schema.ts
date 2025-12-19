import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").unique(),
  username: text("username").unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Markets table
export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  category: text("category").notNull(),
  endDate: text("end_date").notNull(),
  volume: decimal("volume", { precision: 12, scale: 2 }).notNull().default("0"),
  isFeatured: boolean("is_featured").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedOutcomeId: integer("resolved_outcome_id"),
  conditionId: text("condition_id"),
  questionId: text("question_id"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMarketSchema = createInsertSchema(markets).omit({ id: true, createdAt: true });
export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type Market = typeof markets.$inferSelect;

// Market Outcomes table
export const outcomes = pgTable("outcomes", {
  id: serial("id").primaryKey(),
  marketId: integer("market_id").notNull().references(() => markets.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  probability: decimal("probability", { precision: 5, scale: 2 }).notNull(),
  color: text("color").notNull(),
});

export const insertOutcomeSchema = createInsertSchema(outcomes).omit({ id: true });
export type InsertOutcome = z.infer<typeof insertOutcomeSchema>;
export type Outcome = typeof outcomes.$inferSelect;

// Positions table (user's holdings in specific outcomes)
export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  marketId: integer("market_id").notNull().references(() => markets.id, { onDelete: "cascade" }),
  outcomeId: integer("outcome_id").notNull().references(() => outcomes.id, { onDelete: "cascade" }),
  shares: decimal("shares", { precision: 10, scale: 2 }).notNull(),
  avgPrice: decimal("avg_price", { precision: 5, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPositionSchema = createInsertSchema(positions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type Position = typeof positions.$inferSelect;

// Trades table (transaction history)
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  marketId: integer("market_id").notNull().references(() => markets.id, { onDelete: "cascade" }),
  outcomeId: integer("outcome_id").notNull().references(() => outcomes.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'buy' or 'sell'
  shares: decimal("shares", { precision: 10, scale: 2 }).notNull(),
  price: decimal("price", { precision: 5, scale: 4 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTradeSchema = createInsertSchema(trades).omit({ id: true, createdAt: true });
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  marketId: integer("market_id").notNull().references(() => markets.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  outcomeId: integer("outcome_id").notNull().references(() => outcomes.id, { onDelete: "cascade" }),
  side: text("side").notNull(), // 'buy' or 'sell'
  price: decimal("price", { precision: 5, scale: 4 }).notNull(),
  size: decimal("size", { precision: 10, scale: 2 }).notNull(),
  filledSize: decimal("filled_size", { precision: 10, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("open"), // 'open', 'filled', 'cancelled'
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
