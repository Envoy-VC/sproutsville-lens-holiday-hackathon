import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const pgLite = new PGlite('idb://sproutsville-db');
export const db = drizzle(pgLite);
