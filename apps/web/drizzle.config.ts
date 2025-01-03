import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.VITE_POSTGRES_URL!,
  },
});
