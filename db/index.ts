import * as schema from "./migrations/schema";
import { config } from "dotenv";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: join(__dirname, "../.env") });

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
