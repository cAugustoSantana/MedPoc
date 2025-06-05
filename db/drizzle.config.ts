import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv'
import { join } from 'path'
import { drizzle } from 'drizzle-orm/singlestore/driver';

// Go up to the root
config({ path: join(__dirname, '../.env') })
export default defineConfig({
  out: './migrations',
  schema: './schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});