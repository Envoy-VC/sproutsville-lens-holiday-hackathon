import mitt from 'mitt';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- todo: interface gives errors
type Events = {
  teleport: { tileX: number; tileY: number };
};

export const playerEmitter = mitt<Events>();
