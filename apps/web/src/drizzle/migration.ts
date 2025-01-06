export const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS "crops" (
    "id" serial PRIMARY KEY NOT NULL,
    "player_id" integer NOT NULL,
    "cropId" TEXT NOT NULL CHECK ("cropId" IN ('carrots', 'tomatoes', 'potatoes')),
    "plantedAt" timestamp DEFAULT now() NOT NULL,
    "tiles" point[] NOT NULL,
    "harvestAt" timestamp,
    "watering" timestamp[] NOT NULL
);`,
  `CREATE TABLE IF NOT EXISTS "daily_claims" (
    "id" serial PRIMARY KEY NOT NULL,
    "player_id" integer NOT NULL,
    "dayNumber" integer DEFAULT 0 NOT NULL,
    "claimedAt" timestamp DEFAULT now() NOT NULL
);`,

  `CREATE TABLE IF NOT EXISTS "inventory" (
    "id" serial PRIMARY KEY NOT NULL,
    "player_id" integer NOT NULL,
    "itemId" TEXT NOT NULL CHECK ("itemId" IN ('carrots', 'tomatoes', 'potatoes', 'carrots_seed', 'tomatoes_seed', 'potatoes_seed', 'coin')),
    "quantity" integer DEFAULT 0 NOT NULL
);`,

  `CREATE TABLE IF NOT EXISTS "players" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "address" varchar NOT NULL,
    "health" integer DEFAULT 100 NOT NULL,
    "stamina" integer DEFAULT 100 NOT NULL,
    "reputation" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "players_address_unique" UNIQUE("address")
);`,
];
