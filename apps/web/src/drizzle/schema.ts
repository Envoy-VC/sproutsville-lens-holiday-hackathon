import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { allCrops, allSeeds } from '~/types/farming';

const cropsEnum = pgEnum('cropType', allCrops);

const itemsEnum = pgEnum('itemType', [...allCrops, ...allSeeds]);

// Tables for the game
export const players = pgTable('players', {
  id: t.uuid().defaultRandom(),
  name: t.varchar('name', { length: 256 }),
  address: t.varchar('address').unique(),
  health: t.integer().default(100),
  stamina: t.integer().default(100),
  reputation: t.integer().default(0),
});

export const inventory = pgTable('inventory', {
  id: t.uuid().defaultRandom(),
  playerId: t.uuid('playerId').references(() => players.id),
  itemId: itemsEnum(),
  quantity: t.integer().default(0),
});

export const crops = pgTable('crops', {
  id: t.uuid().defaultRandom(),
  playerId: t.uuid('playerId').references(() => players.id),
  cropId: cropsEnum().default('rice'),
  plantedAt: t.timestamp().defaultNow(),
  harvestAt: t.timestamp(),
  watering: t.timestamp().array(),
});

export const traderShop = pgTable('trader_shop', {
  id: t.uuid().defaultRandom(),
  itemId: itemsEnum(),
  stock: t.integer().default(0),
  price: t.integer().default(0),
});

export const townEconomy = pgTable('town_economy', {
  id: t.uuid().defaultRandom(),
  currency: t.integer().default(1000),
});

export const dailyClaims = pgTable('daily_claims', {
  id: t.uuid().defaultRandom(),
  playerId: t.integer('playerId').references(() => players.id),
  claimedAt: t.timestamp().defaultNow(),
});
