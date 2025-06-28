import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { join } from "path";

// Go up to the root
config({ path: join(__dirname, "../.env") });

export default defineConfig({
  out: "./migrations",
  schema: "./migrations/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/medpoc",
  },
});
