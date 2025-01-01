import { GameScene } from '~/game/scenes';

export interface UpdateProps {
  scene: GameScene;
  time: number;
  delta: number;
}

export interface CreatePlayerProps {
  x: number;
  y: number;
  speed: number;
  sprite: string;
  scene: GameScene;
}

export interface TeleportProps {
  tileX: number;
  tileY: number;
  scene: GameScene;
}
