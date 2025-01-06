import { relations } from 'drizzle-orm';
import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { allCrops, allSeeds } from '~/types/farming';

const cropsEnum = pgEnum('cropType', allCrops);

const itemsEnum = pgEnum('itemType', [...allCrops, ...allSeeds]);

// Tables for the game
export const players = pgTable('players', {
  id: t.uuid().defaultRandom().notNull().primaryKey(),
  name: t.varchar('name', { length: 256 }).notNull(),
  address: t.varchar('address').unique().notNull(),
  health: t.integer().default(100).notNull(),
  stamina: t.integer().default(100).notNull(),
  reputation: t.integer().default(0).notNull(),
});

export const inventory = pgTable('inventory', {
  id: t.uuid().defaultRandom().notNull().primaryKey(),
  playerId: t.uuid('playerId').notNull(),
  itemId: itemsEnum().notNull(),
  quantity: t.integer().default(0).notNull(),
});

export const crops = pgTable('crops', {
  id: t.uuid().defaultRandom().notNull().primaryKey(),
  playerId: t.uuid('playerId').notNull(),
  cropId: cropsEnum().notNull(),
  plantedAt: t.timestamp().defaultNow().notNull(),
  tiles: t.point({ mode: 'xy' }).array().notNull(),
  harvestAt: t.timestamp(),
  watering: t.timestamp().array().notNull(),
});

export const traderShop = pgTable('trader_shop', {
  id: t.uuid().defaultRandom().notNull().primaryKey(),
  itemId: itemsEnum().notNull(),
  stock: t.integer().default(0).notNull(),
  price: t.integer().default(0).notNull(),
});

export const dailyClaims = pgTable('daily_claims', {
  id: t.uuid().defaultRandom().notNull().primaryKey(),
  playerId: t.integer('playerId').notNull(),
  dayNumber: t.integer().default(0).notNull(),
  claimedAt: t.timestamp().defaultNow().notNull(),
});

// Relations

// One Player has many Inventory, many Crops
export const playerRelations = relations(players, ({ many }) => ({
  posts: many(inventory),
  crops: many(crops),
  dailyClaims: many(dailyClaims),
}));

// One Inventory belongs to one Player
export const inventoryRelation = relations(inventory, ({ one }) => ({
  author: one(players, {
    fields: [inventory.playerId],
    references: [players.id],
  }),
}));

// One Crop belongs to one Player
export const cropsRelation = relations(crops, ({ one }) => ({
  author: one(players, {
    fields: [crops.playerId],
    references: [players.id],
  }),
}));

// One DailyClaim belongs to one Player
export const dailyClaimsRelation = relations(dailyClaims, ({ one }) => ({
  author: one(players, {
    fields: [dailyClaims.playerId],
    references: [players.id],
  }),
}));
