/* eslint-disable @typescript-eslint/consistent-type-definitions -- safe */
import mitt from 'mitt';

type PlayerEmitterEvents = {
  teleport: { tileX: number; tileY: number };
};

type MusicEmitterEvents = {
  'set-sfx-volume': number;
  'set-music-volume': number;
};

export const playerEmitter = mitt<PlayerEmitterEvents>();
export const musicEmitter = mitt<MusicEmitterEvents>();
