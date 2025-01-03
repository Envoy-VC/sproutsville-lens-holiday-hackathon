import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(import.meta.env.VITE_POSTGRES_URL);
