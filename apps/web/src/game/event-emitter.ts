/* eslint-disable @typescript-eslint/consistent-type-definitions -- safe */
import mitt from 'mitt';

import type { CropType } from '~/types/farming';

type PlayerEmitterEvents = {
  teleport: { tileX: number; tileY: number };
  placeCrops: { type: CropType; tiles: number }[];
};

type MusicEmitterEvents = {
  'set-sfx-volume': number;
  'set-music-volume': number;
};

export const playerEmitter = mitt<PlayerEmitterEvents>();
export const musicEmitter = mitt<MusicEmitterEvents>();
