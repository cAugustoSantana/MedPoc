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

// Create postgres client with better configuration for production
const client = postgres(
  process.env.DATABASE_URL || "postgresql://localhost:5432/medpoc",
  {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }
);

export const db = drizzle(client, { schema });
