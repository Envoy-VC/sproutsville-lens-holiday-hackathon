import Phaser from 'phaser';
import { cropDetails } from '~/data/crops';

import { db } from '.';
import { crops, inventory, players } from './schema';

import type { CropType, SeedType } from '~/types/farming';

export const plantCrop = async (
  address: string,
  crop: CropType,
  tiles: { x: number; y: number }[]
) => {
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

export const getOrCreateItem = async (
  address: string,
  itemId: CropType | SeedType
) => {
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
  itemId: CropType | SeedType,
  quantity: number
) => {
  const item = await getOrCreateItem(address, itemId);
  const newQuantity =
    item.quantity + quantity >= 0 ? item.quantity + quantity : 0;

  await db.update(inventory).set({
    ...item,
    quantity: newQuantity,
  });
};

export const harvestCrop = async (address: string, crop: CropType) => {
  const pendingCrops = await getPendingCrops(address);

  const cropToHarvest = pendingCrops.find((c) => c.cropId === crop);
  if (!cropToHarvest) {
    throw new Error('Crop not found');
  }

  const minHarvestTime =
    cropToHarvest.plantedAt.getTime() +
    cropDetails[crop].growthStages.readyToHarvest[0];
  const isDead =
    cropToHarvest.plantedAt.getTime() + cropDetails[crop].growthStages.dead[1] >
    Date.now();

  const canHarvest = Date.now() >= minHarvestTime;

  if (!canHarvest) {
    throw new Error('Crop not ready to harvest');
  }

  let totalYield = 0;
  if (isDead) {
    totalYield = 0;
  } else {
    const totalSeeds = cropToHarvest.tiles.length;
    for (let i = 0; i < totalSeeds; i++) {
      // Get random number between min and max
      totalYield +=
        cropDetails[crop].yieldVariance.min +
        Phaser.Math.Between(
          cropDetails[crop].yieldVariance.min,
          cropDetails[crop].yieldVariance.max
        );
    }
  }

  // Update inventory
  await updateItemQuantity(address, crop, totalYield);
  // Mark crop as harvested
  await db.update(crops).set({
    ...cropToHarvest,
    harvestAt: new Date(),
  });
};
