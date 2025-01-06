import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  driver: 'pglite',
  dialect: 'postgresql',
  dbCredentials: {
    url: './db',
  },
});
