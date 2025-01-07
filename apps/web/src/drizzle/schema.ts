import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, serial } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { allCrops, allSeeds } from '~/types/farming';

export const cropsEnum = pgEnum('cropType', allCrops);
export const itemsEnum = pgEnum('itemType', [...allCrops, ...allSeeds, 'coin']);

export type ItemType = (typeof itemsEnum.enumValues)[number];

// Tables for the game
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: t.varchar('name', { length: 256 }).notNull(),
  address: t.varchar('address').unique().notNull(),
  health: t.integer().default(100).notNull(),
  stamina: t.integer().default(100).notNull(),
  reputation: t.integer().default(0).notNull(),
});

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  playerId: t.integer('player_id').notNull(),
  itemId: itemsEnum().notNull(),
  quantity: t.integer().default(0).notNull(),
});

export const crops = pgTable('crops', {
  id: serial('id').primaryKey(),
  playerId: t.integer('player_id').notNull(),
  cropId: cropsEnum().notNull(),
  plantedAt: t.timestamp().defaultNow().notNull(),
  tiles: t.point({ mode: 'xy' }).array().notNull(),
  harvestAt: t.timestamp(),
  watering: t.timestamp().array().notNull(),
});

export type Crop = typeof crops.$inferSelect;

export const dailyClaims = pgTable('daily_claims', {
  id: serial('id').primaryKey(),
  playerId: t.integer('player_id').notNull(),
  dayNumber: t.integer().default(0).notNull(),
  claimedAt: t.timestamp().defaultNow().notNull(),
});

// Relations

// One Player has many Inventory, many Crops
export const playerRelations = relations(players, ({ many }) => ({
  crops: many(crops),
  dailyClaims: many(dailyClaims),
  inventory: many(inventory),
}));

// One Inventory belongs to one Player
export const inventoryRelation = relations(inventory, ({ one }) => ({
  players: one(players, {
    fields: [inventory.playerId],
    references: [players.id],
  }),
}));

// One Crop belongs to one Player
export const cropsRelation = relations(crops, ({ one }) => ({
  players: one(players, {
    fields: [crops.playerId],
    references: [players.id],
  }),
}));

// One DailyClaim belongs to one Player
export const dailyClaimsRelation = relations(dailyClaims, ({ one }) => ({
  players: one(players, {
    fields: [dailyClaims.playerId],
    references: [players.id],
  }),
}));
