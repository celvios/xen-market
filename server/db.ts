import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool 
  ? drizzle(pool)
  : null as any;

if (!pool) {
  console.log("Running in mock mode (no DATABASE_URL provided)");
}
