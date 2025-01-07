/* eslint-disable @typescript-eslint/consistent-type-definitions -- safe */
import mitt from 'mitt';

import type { CropType } from '~/types/farming';

interface Tile {
  x: number;
  y: number;
}

type PlayerEmitterEvents = {
  teleport: { tileX: number; tileY: number };
  getEmptyFarmTiles: { amount: number; used: Tile[] };
  getEmptyFarmTilesCallback: Tile[];
  placeCrops: { type: CropType; tiles: Tile[] }[];
};

type MusicEmitterEvents = {
  'set-sfx-volume': number;
  'set-music-volume': number;
};

type TaskType = 'moveToRandom' | 'moveTo';

type TaskManagerEmitterEvents = {
  'task-completed': TaskType;
  'start-task': TaskType;
};

export const playerEmitter = mitt<PlayerEmitterEvents>();
export const musicEmitter = mitt<MusicEmitterEvents>();
export const taskManagerEmitter = mitt<TaskManagerEmitterEvents>();
