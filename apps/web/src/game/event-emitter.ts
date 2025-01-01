import mitt from 'mitt';

type Events = {
  teleport: { tileX: number; tileY: number };
};

export const playerEmitter = mitt<Events>();
