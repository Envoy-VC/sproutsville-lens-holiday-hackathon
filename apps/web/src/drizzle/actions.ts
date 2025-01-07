import { and, eq } from 'drizzle-orm';
import Phaser from 'phaser';
import { cropDetails } from '~/data/crops';
import { lootTable } from '~/data/loot';

import { db } from '.';
import { MIGRATIONS } from './migration';
import {
  type ItemType,
  crops,
  dailyClaims,
  inventory,
  players,
} from './schema';

import type { CropType } from '~/types/farming';

const isBetween = (x: number, [a, b]: [number, number]) => {
  return x >= a && x <= b;
};

const initialize = async () => {
  const initialized = window.localStorage.getItem('migrations-done') === 'yes';
  if (initialized) return;
  const promises = MIGRATIONS.map(async (migration) => {
    await db.execute(migration);
  });
  await Promise.all(promises);
  window.localStorage.setItem('migrations-done', 'yes');
};

export const plantCrop = async (
  address: string,
  crop: CropType,
  tiles: { x: number; y: number }[]
) => {
  await initialize();
  if (tiles.length === 0) return;
  // Get all crops that the player has planted but not harvested
  const seeds = await getOrCreateItem(address, `${crop}_seed`);

  if (seeds.quantity < tiles.length) {
    throw new Error('Not enough seeds');
  }

  const existingCrops = await getPendingCrops(address);
  const totalOccupiedTiles = existingCrops.reduce((acc, crop) => {
    return acc + crop.tiles.length;
  }, 0);

  if (107 - totalOccupiedTiles < tiles.length) {
    throw new Error('Not enough space');
  }

  const player = await getOrCreatePlayer(address);

  // Reduce Seed quantity
  await updateItemQuantity(address, `${crop}_seed`, -tiles.length);
  // Create Crop
  return await db
    .insert(crops)
    .values({
      playerId: player.id,
      cropId: crop,
      tiles,
      watering: [],
    })
    .returning();
};

export const getOrCreatePlayer = async (address: string) => {
  const res = await db.query.players.findFirst({
    where: (player, { eq }) => eq(player.address, address),
  });

  if (!res) {
    const res = await db
      .insert(players)
      .values({
        name: 'Player',
        address,
      })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just inserted this record
    return res[0]!;
  }

  return res;
};

export const getOrCreateItem = async (address: string, itemId: ItemType) => {
  const player = await getOrCreatePlayer(address);

  const res = await db.query.inventory.findFirst({
    where: (item, { eq, and }) =>
      and(eq(item.itemId, itemId), eq(item.playerId, player.id)),
  });

  if (!res) {
    const res = await db
      .insert(inventory)
      .values({
        playerId: player.id,
        itemId,
        quantity: 0,
      })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just inserted this record
    return res[0]!;
  }
  return res;
};

export const getPendingCrops = async (address: string) => {
  const player = await getOrCreatePlayer(address);

  const res = await db.query.crops.findMany({
    where: (crops, { eq, and, isNull }) =>
      and(isNull(crops.harvestAt), eq(crops.playerId, player.id)),
  });

  return res;
};

export const updateItemQuantity = async (
  address: string,
  itemId: ItemType,
  quantity: number
) => {
  const item = await getOrCreateItem(address, itemId);
  const newQuantity =
    item.quantity + quantity >= 0 ? item.quantity + quantity : 0;

  await db
    .update(inventory)
    .set({
      quantity: newQuantity,
    })
    .where(
      and(eq(inventory.playerId, item.playerId), eq(inventory.itemId, itemId))
    );
};

export const harvestCrop = async (address: string, id: number) => {
  const pendingCrops = await getPendingCrops(address);

  const cropToHarvest = pendingCrops.find((c) => c.id === id);
  if (!cropToHarvest) {
    throw new Error('Crop not found');
  }
  const crop = cropToHarvest.cropId;
  console.log('Crop to harvest', cropToHarvest);

  const plantedAt = cropToHarvest.plantedAt.getTime();
  const now = Date.now();
  const growTime = cropDetails[cropToHarvest.cropId].growthStages.growing[1];
  const harvestTime =
    plantedAt +
    cropDetails[cropToHarvest.cropId].growthStages.readyToHarvest[1];
  const isReady = isBetween(now, [plantedAt + growTime, harvestTime]);
  const isDead = isBetween(now, [harvestTime, Infinity]);

  if (!isReady) {
    throw new Error('Crop not ready to harvest');
  }

  let totalCropYield = 0;
  let totalSeedYield = 0;
  if (isDead) {
    totalCropYield = 0;
    totalSeedYield = 0;
  } else {
    const totalSeeds = cropToHarvest.tiles.length;
    for (let i = 0; i < totalSeeds; i++) {
      // Get random number between min and max
      totalCropYield +=
        cropDetails[crop].yieldVariance.min +
        Phaser.Math.Between(
          cropDetails[crop].yieldVariance.min,
          cropDetails[crop].yieldVariance.max
        );
      totalSeedYield += Phaser.Math.Between(
        cropDetails[crop].yieldVariance.min,
        cropDetails[crop].yieldVariance.max
      );
    }
  }

  console.log('Total Crop yield', totalCropYield);
  console.log('Total Seed yield', totalSeedYield);

  // Update inventory
  await updateItemQuantity(address, crop, totalCropYield);
  await updateItemQuantity(address, `${crop}_seed`, totalSeedYield);
  // Mark crop as harvested
  await db
    .update(crops)
    .set({
      harvestAt: new Date(),
    })
    .where(eq(crops.id, cropToHarvest.id));
};

export const getPreviousRewardClaim = async (address: string) => {
  const player = await getOrCreatePlayer(address);

  const res = await db.query.dailyClaims.findMany({
    where: (claim, { eq, and }) => and(eq(claim.playerId, player.id)),
    orderBy: (dailyClaims, { desc }) => [desc(dailyClaims.claimedAt)],
    limit: 7,
  });

  res.sort((a, b) => a.claimedAt.getTime() - b.claimedAt.getTime());
  return res;
};

export const claimDailyReward = async (address: string) => {
  await initialize();
  const player = await getOrCreatePlayer(address);
  const previousClaims = await getPreviousRewardClaim(address);
  let nextClaimDay;
  if (!previousClaims[0]) {
    nextClaimDay = 0;
  } else {
    if (previousClaims[0].claimedAt.getTime() - Date.now() < 86400000) {
      throw new Error('Already claimed today');
    }

    nextClaimDay =
      previousClaims[0].dayNumber + 1 === 6
        ? 0
        : previousClaims[0].dayNumber + 1;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe
  const loot = lootTable[nextClaimDay]!;
  for (const item of loot) {
    await updateItemQuantity(address, item.item, item.quantity);
  }

  await db.insert(dailyClaims).values({
    playerId: player.id,
    dayNumber: nextClaimDay,
    claimedAt: new Date(),
  });
};

export const getInventory = async (address: string) => {
  await initialize();

  const player = await getOrCreatePlayer(address);

  const res = await db.query.inventory.findMany({
    where: (item, { eq }) => eq(item.playerId, player.id),
  });

  return res;
};
