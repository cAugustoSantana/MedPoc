import * as schema from "./migrations/schema";
import { config } from "dotenv";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load environment variables
config({ path: join(__dirname, "../.env") });

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL environment variable is not set");
}

const client = postgres(
  process.env.DATABASE_URL || "postgresql://localhost:5432/medpoc",
);
export const db = drizzle({ client });
