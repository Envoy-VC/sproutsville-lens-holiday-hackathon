import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

import * as schema from './schema';

const pgLite = new PGlite('idb://sproutsville-db');

export const db = drizzle({ schema, client: pgLite });
